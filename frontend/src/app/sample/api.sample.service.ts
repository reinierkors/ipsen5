import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
import {Sample} from './sample.model';
import {Species} from '../species/species.model';

export type CalculationData = {factorClassId:number,computedValue:number};

@Injectable()
export class ApiSampleService extends ApiService{
	constructor(@Inject(Http) http:Http){
		super(http);
	}
	
	public getSample(id:number):Observable<Sample>{
		return this.get('/sample/'+id).map(sample=>Sample.fromJSON(sample));
	}
	
	public save(sample:Sample):Observable<Sample>{
		return this.post('/sample',[sample]).map(samples => Sample.fromJSON(samples[0]));
	}
	
	public saveMulti(samples:Sample[]):Observable<Sample[]>{
		return this.post('/sample',samples).map(samples => samples.map(sample => Sample.fromJSON(sample)));
	}
	
	public getCalculationsBySample(sampleId:number):Observable<CalculationData[]>{
		return this.get('/calculate/sample/'+sampleId);
	}
}
