import {Component,OnInit,Input} from '@angular/core';

import {Sample} from '../sample.model';
import {ApiSampleService,CalculationData} from '../api.sample.service';
import {WEWFactor,WEWFactorClass} from '../../wew/wew.model';
import {ApiWewService} from '../../wew/api.wew.service';
import {Palette,MaterialPalette} from '../../services/palette';

//Value to put in the charts series.data list
type DataValue = {factor:WEWFactor,factorClass:WEWFactorClass,value:number,itemStyle?:any,isReference?:boolean};


@Component({
    selector: 'app-sample-factor-bar-graph',
    providers: [ApiSampleService,ApiWewService],
    templateUrl: './sample-factor-bar-graph.component.html',
    styleUrls: ['./sample-factor-bar-graph.component.css']
})
export class SampleFactorBarGraphComponent implements OnInit {
	//The sample this chart will show data of
	@Input() sample:Sample;
	//The reference for this sample
	@Input() reference:null;
	
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
		Promise.all([this.getFactorsPr,this.getSampleCalcsPr,this.getRefCalcsPr])
			.then(([factors,sampleCalcs,refCalcs]) => this.showData(factors,sampleCalcs,refCalcs));
	}
	
	//EChart instance
	private echart;
	
	//The colors used in this chart
	private samplePalette:Palette = new MaterialPalette().shift();
	private refPalette:Palette = new MaterialPalette().shift().transform(0,-.1,.3);
	
	//Promise that resolves when the wew factors are in
	private getFactorsPr:Promise<WEWFactor[]>;
	//Promise that resolves when the calculation data is in
	private getSampleCalcsPr:Promise<CalculationData[]>;
	//Promise that resolves when the calculation data is in
	private getRefCalcsPr:Promise<CalculationData[]>;
	
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
		private wewApi:ApiWewService
	){
		//Retrieve all factors
		this.getFactorsPr = new Promise((resolve,reject) => this.wewApi.getFactors().subscribe(factors => {
			resolve(factors);
		}));
	}
	
	//@Input()s are available
	ngOnInit(){
		//Retrieve calculations for this sample
		this.getSampleCalcsPr = new Promise((resolve,reject) => this.sampleApi.getCalculationsBySample(this.sample.id).subscribe(calcs => resolve(calcs)));
		
		//Retrieve calculations for the reference
		this.getRefCalcsPr = new Promise((resolve,reject) => this.sampleApi.getCalculationsBySample(this.sample.id+1).subscribe(calcs => resolve(calcs)));
		
		//Then show the chart
		Promise.all([this.getFactorsPr,this.getSampleCalcsPr,this.getRefCalcsPr])
			.then(([factors,sampleCalcs,refCalcs]) => this.showData(factors,sampleCalcs,refCalcs));
	}
	
	onChartInit(echart){
		this.echart = echart;
		echart.showLoading();
	}
	
	//Returns the tooltip that is shown when hovering over the chart
	private tooltipFormatter(params){
		//If param.data is empty, then echart is passing on data from other bar stacks, ignore it
		params = params.filter(param => param.data);
		if(!params.length)
			return;
		
		//Find reference data for each
		let refMap:Map<string/*factor class code*/,DataValue/*reference*/> = new Map();
		params.map(p => p.data).filter(data => data.isReference).forEach((data:DataValue) => refMap.set(data.factorClass.code,data));
		
		//Show params in the same order as they appear in the chart
		params.reverse();
		
		//Return html to be put in the tooltip
		return `<div class="tooltip-title">${params[0].data.factor.name}</div>
			<p>
				<table class="tooltip-table">
					<tr>
						<th colspan="3">&nbsp;</th>
						<th>Referentie</th>
						<th>Monster</th>
					</tr>
					${params.filter(p => !p.data.isReference).map(p => `<tr>
						<td>${p.marker}</td>
						<td>${p.data.factorClass.code}</td>
						<td>${p.data.factorClass.description}</td>
						<td>${refMap.get(p.data.factorClass.code).value.toFixed(2)}</td>
						<td>${p.data.value.toFixed(2)}</td>
					</tr>`).join('')}
				</table>
			</p>`;
	}
	
	//Make a 2D array with all the data (every row is factor, every column a factor class)
	private dataAs2D(factors:WEWFactor[],calcs:CalculationData[]):DataValue[][]{
		//We can have it as a map, it's from a single sample, so no duplicate factor classes
		let calcMap = new Map<number/*factor class id*/,number/*computed value*/>();
		calcs.forEach(calc => calcMap.set(calc.factorClassId,calc.computedValue));
		
		//Fill the array
		let data:DataValue[][] = [];
		factors.forEach((factor,fIndex) => {
			let dataRow:DataValue[] = [];
			factor.classes.forEach((factorClass,fcIndex) => {
				dataRow.push({
					factor:factor,
					factorClass:factorClass,
					value:calcMap.get(factorClass.id)
				});
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
	private showData(factors:WEWFactor[],sampleCalcs:CalculationData[],refCalcs:CalculationData[]){
		//TODO we dont have ref calcs yet, so copy sample calcs
		//refCalcs = sampleCalcs;
		
		//Add x-axis labels
		this.chartOptions.xAxis.data = [];
		factors.forEach(factor => this.chartOptions.xAxis.data.push(factor.name));
		
		//Put values in a 2D array
		let sampleData = this.dataAs2D(factors,sampleCalcs);
		let refData = this.dataAs2D(factors,refCalcs);
		
		//Set property on ref data so we can tell them apart in the tooltip
		refData.forEach(row => row.filter(val => !!val).forEach(val => val.isReference = true));
		
		//Add data
		this.chartOptions.series = [];
		this.addSeries(refData,this.refPalette);
		this.addSeries(sampleData,this.samplePalette);
		
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
