import {Component,OnInit,Input} from '@angular/core';

import {Sample} from '../sample.model';
import {ApiSampleService,CalculationData} from '../api.sample.service';
import {WEWFactor,WEWFactorClass} from '../../wew/wew.model';
import {ApiWewService} from '../../wew/api.wew.service';
import {MaterialPalette} from '../../services/palette';


@Component({
    selector: 'app-sample-factor-bar-graph',
    providers: [ApiSampleService,ApiWewService],
    templateUrl: './sample-factor-bar-graph.component.html',
    styleUrls: ['./sample-factor-bar-graph.component.css']
})
export class SampleFactorBarGraphComponent implements OnInit {
	//The sample this chart will show data of
	@Input() sample:Sample;
	
	//Only draw the chart once the data is in
	public drawChart = false;
	
	//The colors used in this chart
	private palette = new MaterialPalette();
	//Promise that resolves when the wew factors are in
	private getFactorsPr:Promise<WEWFactor[]>;
	//Promise that resolves when the calculation data is in
	private getCalcsPr:Promise<CalculationData[]>;
	//List of all WEW factors
	private factors:WEWFactor[];
	//List of calculations for this sample
	private calculations:CalculationData[];
	
	//EChart options
	public chartOptions = {
		title: {
			text:'Watereigenschappen',
			subtext:'Berekent met behulp van de WEW-lijst'
		},
		toolbox:{feature:{saveAsImage:{}}},
		tooltip:{
			trigger:'axis',
			axisPointer:{type:'shadow'},
			backgroundColor:'rgba(0,0,0,0.8)',
			formatter:this.tooltipFormatter
		},
		legend:{data:[]},
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
			this.factors = factors;
			resolve(factors);
		}));
	}
	
	ngOnInit(){
		//Retrieve calculations for this sample
		this.getCalcsPr = new Promise((resolve,reject) => this.sampleApi.getCalculationsBySample(this.sample.id).subscribe(calcs => resolve(calcs)));
		//Then show the chart
		Promise.all([this.getFactorsPr,this.getCalcsPr]).then(([factors,calcs]) => this.showData(factors,calcs));
	}
	
	//Returns the tooltip that is shown when hovering over the chart
	private tooltipFormatter(params){
		//If param.data is empty, then echart is passing on data from other bar stacks, ignore it
		params = params.filter(param => param.data);
		if(!params.length)
			return;
		return `<div class="tooltip-title">${params[0].data.factor.name}</div>
			<p>
				<table class="tooltip-table">
					${params.map(p => `<tr>
						<td>${p.marker}</td>
						<td>${p.data.factorClass.code}</td>
						<td>${p.data.factorClass.description}</td>
						<td>${p.data.value.toPrecision(3)}</td>
					</tr>`).join('')}
				</table>
			</p>`;
	}
	
	//Stores any data we need to show in this.chartOptions
	private showData(factors:WEWFactor[],calcs:CalculationData[]){
		//We can have it as a map, it's from a single sample, so no duplicate factor classes
		let calcMap = new Map<number/*factor class id*/,number/*computed value*/>();
		calcs.forEach(calc => calcMap.set(calc.factorClassId,calc.computedValue));
		
		//Make sure 2 similar colors are not next to each other
		this.palette.shift();
		
		factors.forEach((factor,fIndex) => {
			//Put factor names along the xAxis
			this.chartOptions.xAxis.data.push(factor.name);
			
			//Make it so not all stacks have the same color order
			this.palette.reverse();
			this.palette.rotate(factor.classes.length);
			
			factor.classes.forEach((factorClass,fcIndex) => {
				//Create the data object for the chart
				let color = this.palette.colorAt(fcIndex).toString();
				let series = {
					name:factorClass.code,
					type:'bar',
					barGap:'-100%',
					barCategoryGap:'30%',
					stack:'stack-'+factor.id,
					data:[
						//This is because echarts maps the data index to the category index
						//Without this, all bars are put under the first factor
						...new Array(fIndex).fill(null),
						{
							//This data is available in the tooltipFormatter
							factor:factor,
							factorClass:factorClass,
							value:calcMap.get(factorClass.id),
							itemStyle:{normal:{color:color}}
						}
					]
				};
				
				this.chartOptions.series.push(series);
			});
		});
		//Show the chart
		this.drawChart = true;
	}
}
