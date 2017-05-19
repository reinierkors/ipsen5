import { Component, OnInit } from '@angular/core';
import {ApiSampleService} from '../api.sample.service';

@Component({
	selector: 'app-sample-view',
	providers: [ApiSampleService],
	templateUrl: './sample-view.component.html',
	styleUrls: ['./sample-view.component.css']
})
export class SampleViewComponent{
	private apiSample:ApiSampleService;
	testValue:string;
	
	constructor(apiSample:ApiSampleService){
		this.apiSample = apiSample;
		
	}
	
	showTestValue():void{
		this.apiSample.test().subscribe(res => this.testValue = res);
	}
}
