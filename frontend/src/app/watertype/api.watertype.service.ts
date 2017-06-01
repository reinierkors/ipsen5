import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
import {Watertype} from './watertype.model';

@Injectable()
export class ApiWatertypeService extends ApiService{
	constructor(@Inject(Http) http:Http){
		super(http);
	}
	
	public getAll():Observable<Watertype[]>{
		return this.get('/watertype').map((watertypes:Object[]) => watertypes.map(watertype=>Watertype.fromJSON(watertype)));
	}
	
	public save(watertype:Watertype):Observable<Watertype>{
		return this.post('/watertype',watertype).map(watertype=>Watertype.fromJSON(watertype));
	}
}
