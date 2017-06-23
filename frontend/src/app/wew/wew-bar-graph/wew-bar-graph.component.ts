import {Component,OnInit,Input} from '@angular/core';

import {Sample} from '../../sample/sample.model';
import {ApiSampleService,CalculationData} from '../../sample/api.sample.service';
import {WEWFactor,WEWFactorClass} from '../wew.model';
import {ApiWewService} from '../api.wew.service';
import {Reference} from '../../reference/reference.model';
import {ApiReferenceService} from '../../reference/api.reference.service';
import {Palette,MaterialPalette} from '../../services/palette';

import 'rxjs/add/operator/toPromise';

//Value to put in the charts series.data list
type DataValue = {factorId:number,factorClassId:number,value:number,itemStyle?:any,entityId:number,entityType:'sample'|'reference',name:string};


@Component({
	selector:'app-wew-bar-graph',
	providers:[ApiSampleService,ApiWewService,ApiReferenceService],
	templateUrl:'./wew-bar-graph.component.html',
	styleUrls:['./wew-bar-graph.component.css']
})
export class WewBarGraphComponent implements OnInit {
	//The samples this chart will show data of
	@Input('samples') inputSamples:Sample[];
	//The references to show
	@Input('references') inputReferences:Reference[];
	//The factors to show
	@Input('factors') inputFactors:WEWFactor[];
	
	/* SETTINGS: SIZE */
	//Size of the graph in pixels
	public width:number;
	public height:number;
	//Space between bars within the same category
	private barGap:string = '10%';
	//Space between categories
	private barCategoryGap:string = '30%';
	/* SETTINGS: COLOR */
	//The colors used in this chart
	private samplePalette:Palette = new MaterialPalette().shift();
	private refPalette:Palette = new MaterialPalette().shift().transform(0,-.1,.3);
	
	
	//EChart instance
	private echart;
	//Promise that resolves when the wew factors are in
	private getFactorsPr:Promise<WEWFactor[]>;
	//Promise that resoles when all required data is loaded
	private allDataPr:Promise<[WEWFactor[],Map<Sample,CalculationData[]>,Map<Reference,CalculationData[]>]>;
	
	/* Maps and arrays for quick lookup and looping */
	private sampleCalcs:Map<Sample,CalculationData[]>;
	private referenceCalcs:Map<Reference,CalculationData[]>;
	private references:Reference[];
	private samples:Sample[];
	private factors:WEWFactor[];
	private factorClasses:WEWFactorClass[];
	private factorIdMap:Map<number/*factor id*/,WEWFactor>;
	private factorClassIdMap:Map<number/*factor class id*/,WEWFactorClass>;
	private referenceIdMap:Map<number/*reference id*/,Reference>;
	private sampleIdMap:Map<number/*sample id*/,Sample>;
	
	
	//EChart options
	public chartOptions = {
		title:{
			text:'Watereigenschappen',
			subtext:'Berekent met behulp van de WEW-lijst'
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
		//Retrieve all factors if none are given as input
		if(this.inputFactors)
			this.getFactorsPr = Promise.resolve(this.inputFactors);
		else
			this.getFactorsPr = this.wewApi.getFactors().toPromise();
	}
	
	//@Input()s are available
	ngOnInit(){
		//Load calculations
		let sampleCalcsPr = this.loadSampleCalculations();
		let referenceCalcsPr = this.loadReferenceCalculations();
		
		//Is all data we need loaded?
		this.allDataPr = Promise.all([this.getFactorsPr,sampleCalcsPr,referenceCalcsPr]);
		//Fill Maps
		this.allDataPr.then(([factors,sampleCalcs,refCalcs]) => this.storeCollections(factors,sampleCalcs,refCalcs));
		//Calculate Size
		this.allDataPr.then(() => this.calculateSize());
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
	private storeCollections(factors:WEWFactor[],sampleCalcs:Map<Sample,CalculationData[]>,referenceCalcs:Map<Reference,CalculationData[]>):void{ console.log(factors);
		this.sampleCalcs = sampleCalcs;
		this.referenceCalcs = referenceCalcs;
		this.references = Array.from(referenceCalcs.keys());
		this.samples = Array.from(sampleCalcs.keys());
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
	}
	
	//Loads the calculations for all samples
	private loadSampleCalculations():Promise<Map<Sample,CalculationData[]>>{
		let sampleCalcs:Map<Sample,CalculationData[]> = new Map();
		let samplePromises = [];
		
		//Retrieve calculations for each sample
		this.inputSamples.forEach(sample => {
			samplePromises.push(this.sampleApi.getCalculationsBySample(sample.id)
				.toPromise().then(calcs => sampleCalcs.set(sample,calcs)));
		});
		
		return Promise.all(samplePromises).then(() => sampleCalcs);
	}
	
	//Loads the calculations of the reference
	private loadReferenceCalculations():Promise<Map<Reference,CalculationData[]>>{
		let referenceCalcs:Map<Reference,CalculationData[]> = new Map();
		let referencePromises = [];
		
		//Retrieve calculations for each reference
		this.inputReferences.forEach(reference => {
			referencePromises.push(this.referenceApi.getCalculationsByReference(reference.id)
				.toPromise().then(calcs => referenceCalcs.set(reference,calcs)));
		});
		
		return Promise.all(referencePromises).then(() => referenceCalcs);
	}
	
	//Make a 2D array with all the data (every row is factor, every column a factor class)
	private dataAs2D(calcs:CalculationData[],entity:Sample|Reference,name:string):DataValue[][]{
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
					entityType:entity instanceof Sample?'sample':'reference'
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
		//Add x-axis labels
		this.chartOptions.xAxis.data = [];
		this.factors.forEach(factor => this.chartOptions.xAxis.data.push(factor.name));
		
		//Clear any previous data
		this.chartOptions.series = [];
		
		//Add reference data
		this.referenceCalcs.forEach((calcs,reference) => {
			let refData = this.dataAs2D(calcs,reference,'Referentie');
			this.addSeries(refData,this.refPalette);
		});
		
		//Add sample data
		this.sampleCalcs.forEach((calcs,sample) => {
			let sampleData = this.dataAs2D(calcs,sample,'Monster');
			this.addSeries(sampleData,this.samplePalette);
		});
		
		//These options should be applied to the last item in the series only
		let lastSeries = this.chartOptions.series[this.chartOptions.series.length-1];
		lastSeries.barGap = this.barGap;
		lastSeries.barCategoryGap = this.barCategoryGap;
		
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
		
		//Reverse the rows, so the first objects show at the top of the graph instead of the bottom
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
		let dataMap:Map<Sample|Reference, Map<WEWFactorClass,DataValue>> = new Map();
		let nameMap:Map<Reference|Sample,string/*name*/> = new Map();
		
		params.map(p => p.data).forEach((data:DataValue) => {
			let entity = data.entityType==='sample'?this.sampleIdMap.get(data.entityId):this.referenceIdMap.get(data.entityId);
			let map = dataMap.get(entity);
			if(!map){
				map = new Map();
				dataMap.set(entity,map);
			}
			map.set(this.factorClassIdMap.get(data.factorClassId),data);
			nameMap.set(entity,data.name);
		});
		
		let names:string[] =  Array.from(nameMap.values());
		
		//Show sample colors if there are any samples, otherwise use reference colors
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
						${[...this.references,...this.samples].map(entity => {
							let dataValue = dataMap.get(entity).get(fc);
							let value = dataValue?dataValue.value:0;
							return `<td>${value.toFixed(2)}</td>`
						}).join('')}
					</tr>`).join('')}
				</table>
			</p>`;
	}
}
