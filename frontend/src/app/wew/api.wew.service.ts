import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
import {WEWValue,WEWFactor,WEWFactorClass} from './wew.model';

@Injectable()
export class ApiWewService extends ApiService{
	constructor(@Inject(Http) http:Http){
		super(http);
	}
	
	public getBySpecies(ids:number[]):Observable<WEWValue[]>{
		return this.get('/wew/value/species/'+ids.join(',')).map(values=>values.map(value => WEWValue.fromJSON(value)));
	}
	
	public saveValues(values:WEWValue[]):Observable<WEWValue[]>{
		return this.post('/wew/value',values).map(values=>values.map(value => WEWValue.fromJSON(value)));
	}
	
	public getFactors():Observable<WEWFactor[]>{
		return this.get('/wew/factor').map(factors=>factors.map(factor => WEWFactor.fromJSON(factor)));
	}
	
	public saveFactors(factors:WEWFactor[]):Observable<WEWFactor[]>{
		return this.post('/wew/factor',factors).map(factors=>factors.map(factor => WEWFactor.fromJSON(factor)));
	}
}
