import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
import {Sample} from './sample.model';
import {Taxon} from '../taxon/taxon.model';

//Value that is calculated in a sample using the WEW list
export type CalculationData = {factorClassId:number,computedValue:number};

@Injectable()
export class ApiSampleService extends ApiService{
	constructor(@Inject(Http) http:Http){
		super(http);
	}
	
	//Retrieve a sample by its id
	public getSample(id:number):Observable<Sample>{
		return this.get('/sample/'+id).map(sample=>Sample.fromJSON(sample));
	}

	//Save a sample to the server
	public save(sample:Sample):Observable<Sample>{
		return this.post('/sample',[sample]).map(samples => Sample.fromJSON(samples[0]));
	}
	
	//Save a list of samples to the server
	public saveMulti(samples:Sample[]):Observable<Sample[]>{
		return this.post('/sample',samples).map(samples => samples.map(sample => Sample.fromJSON(sample)));
	}
	
	//Get a list of calculations for the given sample id
	public getCalculationsBySample(sampleId:number):Observable<CalculationData[]>{
		return this.get('/calculate/sample/'+sampleId);
	}

	public getByLocationId(locationId: number):Observable<Sample[]> {
		return this.get('/sample/getRelevant/' + locationId).map(samples => samples.map(sample => Sample.fromJSON(sample)));
	}

	public getByDate(date: string):Observable<Sample[]> {
		return this.get('/sample/date/' + date).map(samples => samples.map(sample => Sample.fromJSON(sample)));
	}
}
