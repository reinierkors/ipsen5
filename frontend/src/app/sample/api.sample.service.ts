import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
import {Sample} from './sample.model';

@Injectable()
export class ApiSampleService extends ApiService{
	constructor(@Inject(Http) http:Http){
		super(http);
	}
	
	public getSample(id:number):Observable<Sample>{
		return this.get('/sample/'+id).map(sample=>Sample.fromJSON(sample));
	}
	
	public getSamplesByLocation(locationId:number):Observable<Sample[]>{
		return this.get('/sample/Location/'+locationId).map((samples:Object[]) => samples.map(sample=>Sample.fromJSON(sample)));
	}
}
