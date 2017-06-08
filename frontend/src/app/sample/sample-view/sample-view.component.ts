import {Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiSampleService} from '../api.sample.service';
import {Sample} from '../sample.model';

@Component({
	selector: 'app-sample-view',
	providers: [ApiSampleService],
	templateUrl: './sample-view.component.html',
	styleUrls: ['./sample-view.component.css']
})
export class SampleViewComponent implements OnInit{
	private route:ActivatedRoute;
	private apiSample:ApiSampleService;
	public sample:Sample;
	
	constructor(apiSample:ApiSampleService,route:ActivatedRoute){
		this.apiSample = apiSample;
		this.route = route;
	}
	
	ngOnInit(){
		this.route.params
			.switchMap(params => this.apiSample.getSample(params["id"]))
			.subscribe(sample => this.sample = sample, error => console.log(error));
	}

	chartOption = {
		title: {
			text: 'Een grafiek'
		},
		tooltip : {
			trigger: 'axis'
		},
		legend: {
			data:['Sample 1','Sample 2','Sample 3','Sample 4','Sample 5']
		},
		toolbox: {
			feature: {
				saveAsImage: {}
			}
		},
		grid: {
			left: '3%',
			right: '4%',
			bottom: '3%',
			containLabel: true
		},
		xAxis : [
			{
				type : 'category',
				boundaryGap : false,
				data : ['周一','周二','周三','周四','周五','周六','周日']
			}
		],
		yAxis : [
			{
				type : 'value'
			}
		],
		series : [
			{
				name:'Sample 1',
				type:'line',
				stack: '总量',
				areaStyle: {normal: {}},
				data:[120, 132, 101, 134, 90, 230, 210]
			},
			{
				name:'Sample 2',
				type:'line',
				stack: '总量',
				areaStyle: {normal: {}},
				data:[220, 182, 191, 234, 290, 330, 310]
			},
			{
				name:'Sample 3',
				type:'line',
				stack: '总量',
				areaStyle: {normal: {}},
				data:[150, 232, 201, 154, 190, 330, 410]
			},
			{
				name:'Sample 4',
				type:'line',
				stack: '总量',
				areaStyle: {normal: {}},
				data:[320, 332, 301, 334, 390, 330, 320]
			},
			{
				name:'Sample 5',
				type:'line',
				stack: '总量',
				label: {
					normal: {
						show: true,
						position: 'top'
					}
				},
				areaStyle: {normal: {}},
				data:[820, 932, 901, 934, 1290, 1330, 1320]
			}
		]
	}
}
