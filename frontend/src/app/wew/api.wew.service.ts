import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
//import {} from './wew.model';

@Injectable()
export class ApiWewService extends ApiService{
	constructor(@Inject(Http) http:Http){
		super(http);
	}
	
	/*public get():Observable<Wew>{
		return this.get('/wew').map(wew=>Wew.fromJSON(wew));
	}
	
	public save(wew:Wew):Observable<Wew>{
		return this.post('/wew',wew).map(wew => Wew.fromJSON(wew));
	}*/
}
