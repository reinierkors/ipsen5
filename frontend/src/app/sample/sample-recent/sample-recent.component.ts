import {Component,OnInit,ViewChild} from '@angular/core';

import {Sample} from '../sample.model';
import {ApiSampleService} from '../api.sample.service';
import {MarkerLocation} from '../../locations/markerLocation.model';
import {ApiLocationService} from '../../locations/api.location.service';
import {uniqueFilter} from '../../services/arrayUtils';

type SampleRow = {
	id:number,
	date:Date,
	location:string,
	dateAdded:Date
};

@Component({
	selector:'app-sample-recent',
	providers:[ApiSampleService,ApiLocationService],
	templateUrl:'./sample-recent.component.html',
	styleUrls:['./sample-recent.component.css']
})
export class SampleRecentComponent implements OnInit{
	public sampleRows:SampleRow[];
	
	@ViewChild('sampleDateTemplate') sampleDateTemplate;
	@ViewChild('sampleDateAddedTemplate') sampleDateAddedTemplate;
	@ViewChild('sampleButtonTemplate') sampleButtonTemplate;
	
	public sampleColumns = [
		{name:'Locatie',prop:'location',cellTemplate:null},
		{name:'Monster datum',prop:'date',cellTemplate:null},
		{name:'Datum toegevoegd',prop:'dateAdded',cellTemplate:null},
		{name:'Details',prop:'button',cellTemplate:null}
	];
	
	constructor(
		private sampleApi:ApiSampleService,
		private locationApi:ApiLocationService
	){
		this.loadResources().then(([samples,locations]) => this.makeRows(samples,locations));
	}
	
	ngOnInit(){}
	
	ngAfterViewInit(){
		this.sampleColumns[1].cellTemplate = this.sampleDateTemplate;
		this.sampleColumns[2].cellTemplate = this.sampleDateAddedTemplate;
		this.sampleColumns[3].cellTemplate = this.sampleButtonTemplate;
	}
	
	private async loadResources():Promise<[Sample[],MarkerLocation[]]>{
		//Retrieve the 100 most recent samples
		let samples = await this.sampleApi.getRecent(100).toPromise();
		
		//We'll want to show their locations too
		let locationIds = samples.map(sample => sample.locationId).filter(uniqueFilter);
		let locations = await this.locationApi.getByIds(locationIds).toPromise();
		
		return [samples,locations];
	}
	
	private makeRows(samples:Sample[],locations:MarkerLocation[]){
		let locationIdMap:Map<number/*location id*/,MarkerLocation> = new Map();
		locations.forEach(loc => locationIdMap.set(loc.id,loc));
		
		this.sampleRows = samples.map(sample => ({
			id:sample.id,
			date:sample.date,
			dateAdded:sample.dateAdded,
			location:locationIdMap.get(sample.locationId).description
		}));
	}
}
