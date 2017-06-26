import {Component,OnInit,Input,Output,EventEmitter} from '@angular/core';

import {WEWFactor,WEWFactorClass,SimpleWEWValue} from '../wew.model';
import {ApiWewService} from '../api.wew.service';
import {Palette} from '../../services/palette';
import {ChartEntity} from './chart-entity.model';
import {pad2D,uniqueFilter} from '../../services/arrayUtils';

import 'rxjs/add/operator/toPromise';

//Send out with <app-wew-bar-chart (init)="func(WewChartPublicInstance)"></app-wew-bar-chart>
export type WewChartPublicInstance = {
	reload(config?:WewChartConfig),
	resize(width:number,height:number)
};

//The options given as input
export type WewXAxisConfig = 'entity'|'factor';
export type WewChartConfig = {
	entities:ChartEntity[],
	factors?:WEWFactor[],
	barGap?:string,
	barCategoryGap?:string,
	xAxis?:WewXAxisConfig,
	width?:number,
	height?:number
};

//Value to put in the charts series.data list
type DataValue = {factorId:number,factorClassId:number,value:number,itemStyle?:any,entityId:string};


@Component({
	selector:'app-wew-bar-chart',
	providers:[ApiWewService],
	templateUrl:'./wew-bar-chart.component.html',
	styleUrls:['./wew-bar-chart.component.css']
})
export class WewBarChartComponent implements OnInit {
	//The samples this chart will show data of
	@Input() config:WewChartConfig;
	@Output() init = new EventEmitter();
	
	//Size of the chart in pixels
	public width:number;
	public height:number;
	
	//EChart instance
	private echart;
	//DOM of the echart, used to position the tooltip
	private echartDom = null;
	
	//Promise that resoles when all required data is loaded
	private allDataPr:Promise<[WEWFactor[],Map<ChartEntity,SimpleWEWValue[]>]>;
	//Whether or not there is any data to be shown
	private hasData:boolean = true;
	
	/* Maps and arrays for quick lookup and looping */
	private entities:ChartEntity[];
	private entityCalcs:Map<ChartEntity,SimpleWEWValue[]>;
	private entityIdMap:Map<string/*ChartEntity.id*/,ChartEntity>;
	
	private factors:WEWFactor[];
	private factorClasses:WEWFactorClass[];
	private factorIdMap:Map<number/*factor id*/,WEWFactor>;
	private factorClassIdMap:Map<number/*factor class id*/,WEWFactorClass>;
	
	private dataMap:Map<string/*ChartEntity.id+WEWFactorClass.code*/,DataValue>;
	
	//EChart options
	public chartOptions = {
		title:{text:'',subtext:''},
		tooltip:{
			trigger:'axis',
			axisPointer:{type:'shadow'},
			backgroundColor:'rgba(0,0,0,0.9)',
			formatter:(p)=>this.tooltipFormatter(p),
			position:(point,params,dom,rect,size)=>this.tooltipPosition(point,params,dom,rect,size)

		},
		grid:{left:'3%',right:'4%',bottom:'15%',containLabel:true},
		xAxis:{type:'category',data:[],axisLabel:{rotate:45}},
		yAxis:{type:'value',boundaryGap:[0, 0.01],min:0,max:10},
		series:[]
	};
	
	constructor(private wewApi:ApiWewService){}
	
	//@Input()s are available
	ngOnInit(){
		//Set missing config properties to default
		let defaultConfig:WewChartConfig = {
			entities:[],
			factors:[],
			barGap:'15%',
			barCategoryGap:'35%',
			xAxis:'factor',
			width:1000,
			height:300
		};
		this.config = Object.assign(defaultConfig,this.config);
		
		this.width = this.config.width;
		this.height = this.config.height;
		
		//Keep the entity list as-is
		this.entities = this.config.entities;
		
		//Show the charts title
		this.showTitle();
		
		//Retrieve all factors if none are given as input
		let factorsPr:Promise<WEWFactor[]>;
		if(this.config.factors&&this.config.factors.length)
			factorsPr = Promise.resolve(this.config.factors);
		else
			factorsPr = this.wewApi.getFactors().toPromise();
		
		//Load calculations
		let calcsPr = this.loadCalculations();
		
		//Is all data we need loaded?
		this.allDataPr = Promise.all([factorsPr,calcsPr]);
		
		//Fill Maps
		this.allDataPr.then(([factors,calcs]) => this.storeCollections(factors,calcs));
		
		//Should we even show anything?
		this.allDataPr.then(() => {
			let calcCount = Array.from(this.entityCalcs.values())
				.reduce((a,b) => [...a,...b])
				.filter((val:SimpleWEWValue) => val&&val.value)
				.length;
			
			this.hasData = calcCount>0;
		});
		
		//Then show the chart
		this.allDataPr.then(() => this.showData());
		
		//Let the parent know we're done
		this.allDataPr.then(() => this.init.emit(this.getPublicInstance()));
	}
	
	//Object that is outputted to the parent
	private getPublicInstance():WewChartPublicInstance{
		return {
			reload:(config?:WewChartConfig)=>{
				if(config)this.config = config;
				this.ngOnInit();
			},
			resize:(width,height)=>{
				this.width = width;
				this.height = height;
				this.echart.resize({width:this.width,height:this.height});
			}
		};
	}
	
	//EChart instance is available
	public onChartInit(echart){
		echart.resize({width:this.width,height:this.height});
		echart.showLoading();
		this.echart = echart;
	}
	
	//Sets the time based on how many factors we have
	private showTitle(){
		let title = 'Watereigenschappen';
		let subtext = 'Aan de hand van de WEW-lijst';
		
		let factors = this.config.factors;
		if(factors.length===1){
			title += ' - '+factors[0].name;
		}
		
		this.chartOptions.title.text = title;
		this.chartOptions.title.subtext = subtext;
	}
	
	//Put data in arrays and maps for easy access
	private storeCollections(factors:WEWFactor[],entityCalcs:Map<ChartEntity,SimpleWEWValue[]>):void{
		this.entityCalcs = entityCalcs;
		this.factors = factors;
		this.factorClasses = factors.reduce((arr,f) => [...arr,...f.classes],[]);
		
		//Map<number/*factor id*/,WEWFactor>
		this.factorIdMap = new Map();
		this.factors.forEach(f => this.factorIdMap.set(f.id,f));
		
		//Map<number/*factor class id*/,WEWFactorClass>
		this.factorClassIdMap = new Map();
		this.factorClasses.forEach(fc => this.factorClassIdMap.set(fc.id,fc));
		
		//Map<string/*ChartEntity.id*/,ChartEntity>
		this.entityIdMap = new Map();
		this.entities.forEach(entity => this.entityIdMap.set(entity.id,entity));
		
		this.createDataMap();
	}
	
	//Creates all the DataValue objects
	private createDataMap(){
		//Map<string/*ChartEntity.id+WEWFactorClass.code*/,DataValue>
		this.dataMap = new Map();
		
		this.entityCalcs.forEach((calcs,entity) => {
			let calcMap = new Map<number/*factor class id*/,number/*computed value*/>();
			calcs.forEach(calc => calcMap.set(calc.factorClassId,calc.value));
			
			this.factorClasses.forEach(factorClass => {
				this.dataMap.set(entity.id+factorClass.code,{
					factorId:factorClass.factorId,
					factorClassId:factorClass.id,
					value:calcMap.get(factorClass.id),
					entityId:entity.id
				});
			});
		});
	}
	
	//Loads the calculations of all entities
	private async loadCalculations():Promise<Map<ChartEntity,SimpleWEWValue[]>>{
		let calcMap:Map<ChartEntity,SimpleWEWValue[]> = new Map();
		
		//Retrieve calculations for each entity
		let promises = this.entities.map(entity =>
			entity.getCalculations().then(calcs =>
				calcMap.set(entity,calcs)));
		
		return Promise.all(promises).then(() => calcMap);
	}
	
	//Make a 2D array with all the data (every row is a factor, every column a factor class)
	private getDataWithFactorCategory(entity:ChartEntity):DataValue[][]{
		let data = this.factors.map(factor => {
			return factor.classes.map(factorClass => {
				return this.dataMap.get(entity.id+factorClass.code);
			});
		});
		
		return data;
	}
	
	//Make a 2D array with all the data (every row is an entity, every column a factor class)
	private getDataWithEntityCategory(factor:WEWFactor):DataValue[][]{
		let data = this.entities.map(entity => {
			return factor.classes.map(factorClass => {
				return this.dataMap.get(entity.id+factorClass.code);
			});
		});
		
		return data;
	}
	
	//Stores any data we need to show in this.chartOptions
	private showData(){
		if(!this.hasData)
			return;
		
		//Clear any previous data
		this.chartOptions.series = [];
		this.chartOptions.xAxis.data = [];
		
		//Add x-axis labels and data
		if(this.config.xAxis==='entity'){
			this.entities.forEach(entity => this.chartOptions.xAxis.data.push(entity.name));
			this.factors.forEach(factor => this.addSeries(this.getDataWithEntityCategory(factor)));
		}
		else{
			this.factors.forEach(factor => this.chartOptions.xAxis.data.push(factor.name));
			this.entities.forEach(entity => this.addSeries(this.getDataWithFactorCategory(entity)));
		}
		
		//These options should be applied to the last item in the series only
		let lastSeries = this.chartOptions.series[this.chartOptions.series.length-1];
		lastSeries.barGap = this.config.barGap;
		lastSeries.barCategoryGap = this.config.barCategoryGap;
		
		//Show data
		this.echart.setOption(this.chartOptions,true);
		this.echart.resize({width:this.width,height:this.height});
		this.echart.hideLoading();
	}
	
	//Use the palettes to set the correct color in each data value
	private setColors(data:DataValue[][]){
		data.forEach(row => {
			row.filter(val => val!==null).forEach((val,index) => {
				let entity = this.entityIdMap.get(val.entityId);
				val.itemStyle = {normal:{color:entity.palette.colorAt(index).toString()}};
			});
		});
	}
	
	//A series is a list of stacks, with one stack for each category on the x-axis
	private addSeries(data:DataValue[][]){
		//Make sure data is a 2D array (all rows should have the same length)
		data = pad2D(data,null);
		
		//Reverse the rows, so the first objects show at the top of the chart instead of the bottom
		data.forEach(row => row.reverse());
		
		//Set the correct colors
		this.setColors(data);
		
		//Rotate the data array
		let transpose = m => m[0].map((x,i) => m.map(x => x[i]));
		data = transpose(data);
		
		//Put data in chart
		let stack = Math.random();
		data.forEach(row => {
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
		
		//The entities in the category we're hovering over
		let entities:ChartEntity[] = params.map(p => this.entityIdMap.get(p.data.entityId)).filter(uniqueFilter);
		
		//List of names
		let names:string[] = entities.map(entity => entity.name);
		
		//Show sample colors if there are any samples, otherwise use any other
		let markers:Map<WEWFactorClass,string/*marker html*/> = new Map();
		//TODO: decide what markers to show in a less hacky way
		let markerParams = params.filter(p => p.data.entityId.substr(0,6)==='sample');
		if(!markerParams.length)
			markerParams = params;
		markerParams.forEach(p => markers.set(this.factorClassIdMap.get(p.data.factorClassId),p.marker));
		
		//Return html to be put in the tooltip
		return `<div class="wewChartTooltip"><div class="tooltip-title">${factor.name}</div>
			<p>
				<table class="tooltip-table">
					<thead>
						<tr>
							<th colspan="3">&nbsp;</th>
							${names.map(name => `<th class="entity-name">${name}</th>`).join('')}
						</tr>
					</thead>
					<tbody>
						${factor.classes.map(fc => `<tr>
							<td>${markers.get(fc)}</td>
							<td>${fc.code}</td>
							<td>${fc.description}</td>
							${entities.map(entity => {
								let dataValue = this.dataMap.get(entity.id+fc.code);
								let value = (dataValue!=null&&dataValue.value!=null)?dataValue.value.toFixed(2):'?';
								return `<td>${value}</td>`
							}).join('')}
						</tr>`).join('')}
					</tbody>
				</table>
			</p></div>`;
	}
	
	//Tooltip won't show when inside some container
	private tooltipPosition([mouseX,mouseY],params,dom,rect,{viewSize:[chartWidth,chartHeight],contentSize:[tooltipWidth,tooltipHeight]}){
		//Get chart position
		let echartDom;
		if(this.echartDom===null)
			this.echartDom = echartDom = dom.parentNode;
		else
			echartDom = this.echartDom;
		let chartRect = echartDom.getBoundingClientRect();
		let chartX = chartRect.left;
		let chartY = chartRect.top;
		
		//Mouse X and Y are relative to the chart, so add those together
		let left = mouseX+chartX;
		let top = mouseY+chartY;
		
		//Put the middle of the tooltip above the mouse
		left -= tooltipWidth/2;
		//Put the tooltip above the mouse
		top -= tooltipHeight + 20;
		
		//Throw it in the body
		document.body.appendChild(dom);
		
		//Checks
		if(left<0)left = 0;
		if(top<0)top = 0;
		
		return {left,top};
	}
}
