import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
import {Waterschap} from './waterschap.model';

@Injectable()
export class ApiWaterschapService extends ApiService{
	constructor(@Inject(Http) http:Http){
		super(http);
	}
	
	public getAll():Observable<Waterschap[]>{
		return this.get('/waterschap').map((waterschappen:Object[]) => waterschappen.map(waterschap=>Waterschap.fromJSON(waterschap)));
	}
}
