import {Component,OnInit,Input} from '@angular/core';

import {Sample} from '../../sample/sample.model';
import {Reference} from '../../reference/reference.model';
import {Taxon} from '../../taxon/taxon.model';
import {WEWFactor,WEWFactorClass} from '../wew.model';
import {ApiSampleService,CalculationData} from '../../sample/api.sample.service';
import {ApiWewService} from '../api.wew.service';
import {ApiReferenceService} from '../../reference/api.reference.service';
import {Palette} from '../../services/palette';

import 'rxjs/add/operator/toPromise';

//The options given as input
export type WewSampleConfig = {name:string,sample:Sample,palette:Palette};
export type WewReferenceConfig = {name:string,reference:Reference,palette:Palette};
export type WewTaxonConfig = {taxon:Taxon,palette:Palette};
export type WewChartConfig = {
	samples?:WewSampleConfig[],
	references?:WewReferenceConfig[],
	taxa?:WewTaxonConfig[],
	factors?:WEWFactor[],
	barGap?:string,
	barCategoryGap?:string
};

//Value to put in the charts series.data list
type DataValue = {factorId:number,factorClassId:number,value:number,itemStyle?:any,entityId:number,entityType:'sample'|'reference'|'taxon',name:string};


@Component({
	selector:'app-wew-bar-chart',
	providers:[ApiSampleService,ApiWewService,ApiReferenceService],
	templateUrl:'./wew-bar-chart.component.html',
	styleUrls:['./wew-bar-chart.component.css']
})
export class WewBarChartComponent implements OnInit {
	//The samples this chart will show data of
	@Input() config:WewChartConfig;
	
	//Size of the chart in pixels
	public width:number;
	public height:number;
	
	//EChart instance
	private echart;
	//Promise that resoles when all required data is loaded
	private allDataPr:Promise<[WEWFactor[],Map<Sample,CalculationData[]>,Map<Reference,CalculationData[]>,Map<Taxon,CalculationData[]>]>;
	//Whether or not there is any data to be shown
	private hasData:boolean = true;
	
	/* Maps and arrays for quick lookup and looping */
	private sampleCalcs:Map<Sample,CalculationData[]>;
	private referenceCalcs:Map<Reference,CalculationData[]>;
	private taxonCalcs:Map<Taxon,CalculationData[]>;
	private references:Reference[];
	private samples:Sample[];
	private taxa:Taxon[];
	private factors:WEWFactor[];
	private factorClasses:WEWFactorClass[];
	private factorIdMap:Map<number/*factor id*/,WEWFactor>;
	private factorClassIdMap:Map<number/*factor class id*/,WEWFactorClass>;
	private referenceIdMap:Map<number/*reference id*/,Reference>;
	private sampleIdMap:Map<number/*sample id*/,Sample>;
	private taxonIdMap:Map<number/*taxon id*/,Taxon>;
	private sampleConfigMap:Map<Sample,WewSampleConfig>;
	private referenceConfigMap:Map<Reference,WewReferenceConfig>;
	private taxonConfigMap:Map<Taxon,WewTaxonConfig>;
	
	
	//EChart options
	public chartOptions = {
		title:{
			text:'Watereigenschappen',
			subtext:'Aan de hand van de WEW-lijst'
		},
		tooltip:{
			trigger:'axis',
			axisPointer:{type:'shadow'},
			backgroundColor:'rgba(0,0,0,0.9)',
			formatter:(p)=>this.tooltipFormatter(p)
		},
		//legend:{data:[]},
		grid:{left:'3%',right:'4%',bottom:'3%',containLabel:true},
		xAxis:{type:'category',data:[]},
		yAxis:{type:'value',boundaryGap:[0, 0.01],min:0,max:10},
		series:[]
	};
	
	constructor(
		private sampleApi:ApiSampleService,
		private wewApi:ApiWewService,
		private referenceApi:ApiReferenceService
	){
	}
	
	//@Input()s are available
	ngOnInit(){
		//Set any missing config arrays
		if(!this.config.taxa)this.config.taxa = [];
		if(!this.config.samples)this.config.samples = [];
		if(!this.config.references)this.config.references = [];
		
		//Retrieve all factors if none are given as input
		let factorsPr:Promise<WEWFactor[]>;
		if(this.config.factors&&this.config.factors.length)
			factorsPr = Promise.resolve(this.config.factors);
		else
			factorsPr = this.wewApi.getFactors().toPromise();
		
		//Load calculations
		let sampleCalcsPr = this.loadSampleCalculations();
		let referenceCalcsPr = this.loadReferenceCalculations();
		let taxonCalcsPr = this.loadTaxonCalculations();
		
		//Is all data we need loaded?
		this.allDataPr = Promise.all([factorsPr,sampleCalcsPr,referenceCalcsPr,taxonCalcsPr]);
		//Fill Maps
		this.allDataPr.then(([factors,sampleCalcs,refCalcs,taxonCalcs]) => this.storeCollections(factors,sampleCalcs,refCalcs,taxonCalcs));
		//Calculate Size
		this.allDataPr.then(() => this.calculateSize());
		//Should we even show anything?
		this.allDataPr.then(() => {
			let calcCount = [this.sampleCalcs,this.referenceCalcs,this.taxonCalcs]
				.map(map => Array.from(map.values()))
				.reduce((a,b) => [...a,...b],[])
				.reduce((a,b) => [...a,...b],[])
				.filter(calc => calc && calc.computedValue)
				.length;
			this.hasData = calcCount>0;
		});
		//Then show the chart
		this.allDataPr.then(() => this.showData());
	}
	
	//EChart instance is available
	public onChartInit(echart){
		this.echart = echart;
		echart.showLoading();
	}
	
	private calculateSize(){
		this.width = 1000;
		this.height = 300;
		this.echart.resize({width:this.width,height:this.height});
	}
	
	//Put data in arrays and maps for easy access
	private storeCollections(factors:WEWFactor[],
		sampleCalcs:Map<Sample,CalculationData[]>,
		referenceCalcs:Map<Reference,CalculationData[]>,
		taxonCalcs:Map<Taxon,CalculationData[]>
	):void{
		this.sampleCalcs = sampleCalcs;
		this.referenceCalcs = referenceCalcs;
		this.taxonCalcs = taxonCalcs;
		this.references = Array.from(referenceCalcs.keys());
		this.samples = Array.from(sampleCalcs.keys());
		this.taxa = Array.from(taxonCalcs.keys());
		this.factors = factors;
		this.factorClasses = factors.reduce((arr,f) => [...arr,...f.classes],[]);
		
		//Map<number/*factor id*/,WEWFactor>
		this.factorIdMap = new Map();
		this.factors.forEach(f => this.factorIdMap.set(f.id,f));
		
		//Map<number/*factor class id*/,WEWFactorClass>
		this.factorClassIdMap = new Map();
		this.factorClasses.forEach(fc => this.factorClassIdMap.set(fc.id,fc));
		
		//Map<number/*reference id*/,Reference>
		this.referenceIdMap = new Map();
		this.references.forEach(ref => this.referenceIdMap.set(ref.id,ref));
		
		//Map<number/*sample id*/,Sample>
		this.sampleIdMap = new Map();
		this.samples.forEach(sample => this.sampleIdMap.set(sample.id,sample));
		
		//Map<number/*taxon id*/,Taxo>
		this.taxonIdMap = new Map();
		this.taxa.forEach(taxon => this.taxonIdMap.set(taxon.id,taxon));
		
		//Map<Sample,WewSampleConfig>
		this.sampleConfigMap = new Map();
		this.config.samples.forEach(sampleConfig => this.sampleConfigMap.set(sampleConfig.sample,sampleConfig));
		
		//Map<Reference,WewReferenceConfig>
		this.referenceConfigMap = new Map();
		this.config.references.forEach(refConfig => this.referenceConfigMap.set(refConfig.reference,refConfig));
		
		//Map<Taxon,WewTaxonConfig>
		this.taxonConfigMap = new Map();
		this.config.taxa.forEach(taxonConfig => this.taxonConfigMap.set(taxonConfig.taxon,taxonConfig));
	}
	
	//Loads the calculations of all samples
	private loadSampleCalculations():Promise<Map<Sample,CalculationData[]>>{
		let sampleCalcs:Map<Sample,CalculationData[]> = new Map();
		let samplePromises = [];
		
		//Retrieve calculations for each sample
		this.config.samples.map(s => s.sample).forEach(sample => {
			samplePromises.push(this.sampleApi.getCalculationsBySample(sample.id)
				.toPromise().then(calcs => sampleCalcs.set(sample,calcs)));
		});
		
		return Promise.all(samplePromises).then(() => sampleCalcs);
	}
	
	//Loads the calculations of all references
	private loadReferenceCalculations():Promise<Map<Reference,CalculationData[]>>{
		let referenceCalcs:Map<Reference,CalculationData[]> = new Map();
		let referencePromises = [];
		
		//Retrieve calculations for each reference
		this.config.references.map(r => r.reference).forEach(reference => {
			referencePromises.push(this.referenceApi.getCalculationsByReference(reference.id)
				.toPromise().then(calcs => referenceCalcs.set(reference,calcs)));
		});
		
		return Promise.all(referencePromises).then(() => referenceCalcs);
	}
	
	//Loads the calculations of all taxa
	private loadTaxonCalculations():Promise<Map<Taxon,CalculationData[]>>{
		let taxonCalcs:Map<Taxon,CalculationData[]> = new Map();
		let taxonPromises = [];
		
		//Retrieve calculations for each taxon
		this.config.taxa.map(t => t.taxon).forEach(taxon => {
			taxonPromises.push(this.wewApi.getByTaxon([taxon.id])
				.toPromise().then(wewValues => {
					//This api call returns WEWValue objects, turn them into CalculationData objects
					let calcs = wewValues.map(val => ({factorClassId:val.factorClassId,computedValue:val.value}));
					taxonCalcs.set(taxon,calcs)
				}));
		});
		
		return Promise.all(taxonPromises).then(() => taxonCalcs);
	}
	
	//Make a 2D array with all the data (every row is factor, every column a factor class)
	private dataAs2D(calcs:CalculationData[],entity:Sample|Reference|Taxon,name:string):DataValue[][]{
		//We can have it as a map, it's from a single sample, so no duplicate factor classes
		let calcMap = new Map<number/*factor class id*/,number/*computed value*/>();
		calcs.forEach(calc => calcMap.set(calc.factorClassId,calc.computedValue));
		
		//Fill the array
		let data:DataValue[][] = [];
		this.factors.forEach((factor,fIndex) => {
			let dataRow:DataValue[] = [];
			factor.classes.forEach((factorClass,fcIndex) => {
				let valueObj:DataValue = {
					factorId:factor.id,
					factorClassId:factorClass.id,
					value:calcMap.get(factorClass.id),
					name:name,
					entityId:entity.id,
					entityType:entity instanceof Sample?'sample':(entity instanceof Reference?'reference':'taxon')
				};
				dataRow.push(valueObj);
			});
			data.push(dataRow);
		});
		
		//Make sure all rows have the same length (pad with null)
		let max = data.map(row => row.length).reduce((next,max) => Math.max(next,max));
		data = data.map(row => {
			let len = row.length;
			row.length = max;
			row.fill(null,len);
			return row;
		});
		
		return data;
	}
	
	//Stores any data we need to show in this.chartOptions
	private showData(){
		if(!this.hasData)
			return;
		
		//Add x-axis labels
		this.chartOptions.xAxis.data = [];
		this.factors.forEach(factor => this.chartOptions.xAxis.data.push(factor.name));
		
		//Clear any previous data
		this.chartOptions.series = [];
		
		//Add reference data
		this.referenceCalcs.forEach((calcs,reference) => {
			let config = this.referenceConfigMap.get(reference);
			let refData = this.dataAs2D(calcs,reference,config.name);
			this.addSeries(refData,config.palette);
		});
		
		//Add sample data
		this.sampleCalcs.forEach((calcs,sample) => {
			let config = this.sampleConfigMap.get(sample);
			let sampleData = this.dataAs2D(calcs,sample,config.name);
			this.addSeries(sampleData,config.palette);
		});
		
		//Add taxon data
		this.taxonCalcs.forEach((calcs,taxon) => {
			let config = this.taxonConfigMap.get(taxon);
			let taxonData = this.dataAs2D(calcs,taxon,taxon.name);
			this.addSeries(taxonData,config.palette);
		});
		
		
		//These options should be applied to the last item in the series only
		let lastSeries = this.chartOptions.series[this.chartOptions.series.length-1];
		lastSeries.barGap = this.config.barGap;
		lastSeries.barCategoryGap = this.config.barCategoryGap;
		
		//Show data
		this.echart.setOption(this.chartOptions,true);
		this.echart.hideLoading();
	}
	
	private addSeries(data:DataValue[][],palette:Palette){
		//Set chart colors
		data.forEach(row => {
			palette.reverse();
			palette.rotate(3);
			row.filter(val => val!==null).forEach((val,index) => {
				val.itemStyle = {normal:{color:palette.colorAt(index).toString()}};
			});
		});
		
		//Reverse the rows, so the first objects show at the top of the chart instead of the bottom
		data.forEach(row => row.reverse());
		
		//Rotate the data array
		let transpose = m => m[0].map((x,i) => m.map(x => x[i]));
		data = transpose(data);
		
		//Put data in chart
		let stack = Math.random();
		data.forEach((row,index) => {
			let series = {
				type:'bar',
				stack:stack,
				data:row
			};
			this.chartOptions.series.push(series);
		});
	}
	
	//Returns the tooltip that is shown when hovering over the chart
	private tooltipFormatter(params){
		//If param.data is empty, then echart is passing on data from other bar stacks, ignore it
		params = params.filter(param => param.data);
		if(!params.length)
			return;
		
		//The factor we're hovering over
		let factor:WEWFactor = this.factorIdMap.get(params[0].data.factorId);
		
		//Find references, samples and their data
		let dataMap:Map<Sample|Reference|Taxon, Map<WEWFactorClass,DataValue>> = new Map();
		let nameMap:Map<Reference|Sample|Taxon,string/*name*/> = new Map();
		
		params.map(p => p.data).forEach((data:DataValue) => {
			let entityMap = data.entityType==='sample'?this.sampleIdMap:(data.entityType==='reference'?this.referenceIdMap:this.taxonIdMap);
			let entity = entityMap.get(data.entityId);
			let map = dataMap.get(entity);
			if(!map){
				map = new Map();
				dataMap.set(entity,map);
			}
			map.set(this.factorClassIdMap.get(data.factorClassId),data);
			nameMap.set(entity,data.name);
		});
		
		let names:string[] =  Array.from(nameMap.values());
		
		//Show sample colors if there are any samples, otherwise use any other
		let markers:Map<WEWFactorClass,string/*marker html*/> = new Map();
		let markerParams = params.filter(p => p.data.entityType==='sample');
		if(!markerParams.length)
			markerParams = params;
		markerParams.forEach(p => markers.set(this.factorClassIdMap.get(p.data.factorClassId),p.marker));
		
		//Return html to be put in the tooltip
		return `<div class="tooltip-title">${factor.name}</div>
			<p>
				<table class="tooltip-table">
					<tr>
						<th colspan="3">&nbsp;</th>
						${names.map(name => `<th>${name}</th>`).join('')}
					</tr>
					${factor.classes.map(fc => `<tr>
						<td>${markers.get(fc)}</td>
						<td>${fc.code}</td>
						<td>${fc.description}</td>
						${[...this.references,...this.samples,...this.taxa].map(entity => {
							let dataValue = dataMap.get(entity).get(fc);
							let value = (dataValue!=null&&dataValue.value!=null)?dataValue.value.toFixed(2):'?';
							return `<td>${value}</td>`
						}).join('')}
					</tr>`).join('')}
				</table>
			</p>`;
	}
}
