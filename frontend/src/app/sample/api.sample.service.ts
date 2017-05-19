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
	
	test():Observable<string>{
		return this.get('/sample/test');
	}
}
