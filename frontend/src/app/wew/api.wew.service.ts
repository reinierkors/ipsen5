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
	
	//Returns number of inserted values
	public saveValues(values:WEWValue[]):Observable<number>{
		return this.post('/wew/value',values).map(obj=>obj.count);
	}
	
	public getFactors():Observable<WEWFactor[]>{
		return this.get('/wew/factor').map(factors=>factors.map(factor => WEWFactor.fromJSON(factor)));
	}
	
	public saveFactors(factors:WEWFactor[]):Observable<WEWFactor[]>{
		return this.post('/wew/factor',factors).map(factors=>factors.map(factor => WEWFactor.fromJSON(factor)));
	}
	
	public areTablesEmpty():Observable<boolean>{
		return this.get('/wew/isEmpty');
	}
	
	public emptyAllTables():Observable<boolean>{
		return this.post('/wew/emptyAll',null);
	}
}
