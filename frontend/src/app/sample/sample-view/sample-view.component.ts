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
}
