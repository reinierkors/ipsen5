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
	
	//Retrieve a watertype by its id
	public getWatertype(id):Observable<Watertype>{
		return this.get('/watertype/' + id).map(watertype => Watertype.fromJSON(watertype));
	}
	
	//Retrieve a list of all watertypes
	public getAll():Observable<Watertype[]>{
		return this.get('/watertype').map((watertypes:Object[]) => watertypes.map(watertype=>Watertype.fromJSON(watertype)));
	}
	
	//Save a watertype to the server
	public save(watertype:Watertype):Observable<Watertype>{
		return this.post('/watertype',watertype).map(watertype=>Watertype.fromJSON(watertype));
	}
}
