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
type DataValue = {factor:WEWFactor,factorClass:WEWFactorClass,value:number,itemStyle?:any,entity:Reference|Sample,name:string};


@Component({
    selector: 'app-wew-bar-graph',
    providers: [ApiSampleService,ApiWewService,ApiReferenceService],
    templateUrl: './wew-bar-graph.component.html',
    styleUrls: ['./wew-bar-graph.component.css']
})
export class WewBarGraphComponent implements OnInit {
	//The samples this chart will show data of
	@Input('samples') inputSamples:Sample[];
	//The references to show
	@Input('references') inputReferences:Reference[];
	//The factors to show
	@Input('factors') inputFactors:WEWFactor[];
	
	
	//temp
	testSettings = {h:0,s:-.1,l:.3,o:30};
	testPresets = [
		{name:'Dark',h:-.02,s:.15,l:-.22,o:null},
		{name:'Light',h:.02,s:-.1,l:.3,o:null},
		{name:'Overlap',h:null,s:null,l:null,o:-66},
		{name:'Seperated',h:null,s:null,l:null,o:30}
	];
	testBtn(preset){
		if(preset.h!==null)this.testSettings.h = preset.h;
		if(preset.s!==null)this.testSettings.s = preset.s;
		if(preset.l!==null)this.testSettings.l = preset.l;
		if(preset.o!==null)this.testSettings.o = preset.o;
		this.testUpdate();
	}
	testUpdate(){
		this.refPalette = new MaterialPalette().shift().transform(this.testSettings.h,this.testSettings.s,this.testSettings.l);
		this.samplePalette = new MaterialPalette().shift();
		//Promise.all([this.getFactorsPr,this.getSampleCalcsPr,this.getRefCalcsPr])
			//.then(([factors,sampleCalcs,refCalcs]) => this.showData(factors,sampleCalcs,refCalcs));
	}
	
	//EChart instance
	private echart;
	
	//The colors used in this chart
	private samplePalette:Palette = new MaterialPalette().shift();
	private refPalette:Palette = new MaterialPalette().shift().transform(0,-.1,.3);
	
	//Promise that resolves when the wew factors are in
	private getFactorsPr:Promise<WEWFactor[]>;
	//Promise that resoles when all required data is loaded
	private dataPr:Promise<null>;
	
	//EChart options
	public chartOptions = {
		title: {
			text:'Watereigenschappen',
			subtext:'Berekent met behulp van de WEW-lijst'
		},
		tooltip:{
			trigger:'axis',
			axisPointer:{type:'shadow'},
			backgroundColor:'rgba(0,0,0,0.9)',
			formatter:this.tooltipFormatter
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
		
		//Then show the chart
		Promise.all([this.getFactorsPr,sampleCalcsPr,referenceCalcsPr])
			.then(([factors,sampleCalcs,refCalcs]) => this.showData(factors,sampleCalcs,refCalcs));
	}
	
	onChartInit(echart){
		this.echart = echart;
		echart.showLoading();
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
	
	//Returns the tooltip that is shown when hovering over the chart
	//ToDo: do less in this method to speed things up
	private tooltipFormatter(params){
		//If param.data is empty, then echart is passing on data from other bar stacks, ignore it
		params = params.filter(param => param.data);
		if(!params.length)
			return;
		
		//Find factor classes
		let factorClassMap:Map<string/*code*/,WEWFactorClass> = new Map();
		params.map(p => p.data.factorClass).forEach(fc => factorClassMap.set(fc.code,fc));
		let factorClasses = Array.from(factorClassMap.values()).sort((fc1,fc2) => fc2.order-fc1.order);
		
		//Prevent duplicate samples and references
		let refIdMap:Map<number/*ref id*/,Reference> = new Map();
		let sampleIdMap:Map<number/*sample id*/,Sample> = new Map();
		params.map(p => p.data).forEach((data:DataValue) => {
			let idMap = data.entity instanceof Sample?sampleIdMap:refIdMap;
			let entity = idMap.get(data.entity.id);
			if(entity)
				data.entity = entity;
			else
				(<any>idMap).set(data.entity.id,data.entity);
		});
		
		//Find references, samples and their data
		let dataMap:Map<Sample|Reference, Map<WEWFactorClass,DataValue>> = new Map();
		let nameMap:Map<Reference|Sample,string/*name*/> = new Map();
		
		params.map(p => p.data).forEach((data:DataValue) => {
			//let dataMap = data.entity instanceof Sample?sampleDataMap:refDataMap;
		 	let map = dataMap.get(data.entity);
			if(!map){
				map = new Map();
				dataMap.set(data.entity,map);
			}
			map.set(factorClassMap.get(data.factorClass.code),data);
			nameMap.set(data.entity,data.name);
		});
		
		let entities:(Sample|Reference)[] = Array.from(dataMap.keys());
		let samples:Sample[] = <Sample[]>entities.filter(entity => entity instanceof Sample);
		let references:Reference[] = <Reference[]>entities.filter(entity => entity instanceof Reference);
		let names:string[] =  Array.from(nameMap.values());
		
		//Show sample colors if there are any samples, otherwise use reference colors
		let markers:Map<WEWFactorClass,string/*marker html*/> = new Map();
		if(samples.length)
			params.filter(p => p.data.sample).forEach(p => markers.set(p.data.factorClass,p.marker));
		else
			params.forEach(p => markers.set(p.data.factorClass,p.marker));
		
		//Return html to be put in the tooltip
		return `<div class="tooltip-title">${params[0].data.factor.name}</div>
			<p>
				<table class="tooltip-table">
					<tr>
						<th colspan="3">&nbsp;</th>
						${names.map(name => `<th>${name}</th>`).join('')}
					</tr>
					${factorClasses.map(fc => `<tr>
						<td>${markers.get(fc)}</td>
						<td>${fc.code}</td>
						<td>${fc.description}</td>
						${entities.map(entity => {
							let value = dataMap.get(entity).get(fc).value;
							return `<td>${value===null?'?':value.toFixed(2)}</td>`
						}).join('')}
					</tr>`).join('')}
				</table>
			</p>`;
	}
	
	//Make a 2D array with all the data (every row is factor, every column a factor class)
	private dataAs2D(factors:WEWFactor[],calcs:CalculationData[],entity:Sample|Reference,name:string):DataValue[][]{
		//We can have it as a map, it's from a single sample, so no duplicate factor classes
		let calcMap = new Map<number/*factor class id*/,number/*computed value*/>();
		calcs.forEach(calc => calcMap.set(calc.factorClassId,calc.computedValue));
		
		//Fill the array
		let data:DataValue[][] = [];
		factors.forEach((factor,fIndex) => {
			let dataRow:DataValue[] = [];
			factor.classes.forEach((factorClass,fcIndex) => {
				let valueObj = {
					factor:factor,
					factorClass:factorClass,
					value:calcMap.get(factorClass.id),
					name:name,
					entity:entity
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
	private showData(factors:WEWFactor[],sampleCalcs:Map<Sample,CalculationData[]>,refCalcs:Map<Reference,CalculationData[]>){
		//Add x-axis labels
		this.chartOptions.xAxis.data = [];
		factors.forEach(factor => this.chartOptions.xAxis.data.push(factor.name));
		
		//Clear any previous data
		this.chartOptions.series = [];
		
		//Add reference data
		refCalcs.forEach((calcs,reference) => {
			let refData = this.dataAs2D(factors,calcs,reference,'Referentie');
			this.addSeries(refData,this.refPalette);
		});
		
		//Add sample data
		sampleCalcs.forEach((calcs,sample) => {
			let sampleData = this.dataAs2D(factors,calcs,sample,'Monster');
			this.addSeries(sampleData,this.samplePalette);
		});
		
		//These options should be applied to the last item in the series only
		let lastSeries = this.chartOptions.series[this.chartOptions.series.length-1];
		lastSeries.barGap = this.testSettings.o+'%';
		lastSeries.barCategoryGap = '30%';
		
		//Show data
		this.echart.setOption(this.chartOptions,true);
		this.echart.hideLoading();
	}
	
	private addSeries(data:DataValue[][],palette:Palette){
		//Set chart colors
		data.forEach((row) => {
			palette.reverse();
			palette.rotate(3);
			row.filter(val => val!==null).forEach((val,index) => {
				val.itemStyle = {normal:{color:palette.colorAt(index).toString()}};
			});
		});
		
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
}
