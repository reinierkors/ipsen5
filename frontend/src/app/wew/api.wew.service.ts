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
	
	//Retrieve all WEW values from the taxon with these ids
	public getByTaxon(ids:number[]):Observable<WEWValue[]>{
		return this.get('/wew/value/taxon/'+ids.join(',')).map(values=>values.map(value => WEWValue.fromJSON(value)));
	}
	
	//Saves a list of values
	//Returns number of inserted values
	public saveValues(values:WEWValue[]):Observable<number>{
		return this.post('/wew/value',values).map(obj=>obj.count);
	}
	
	//Retrieves all factors and factor classes in them
	public getFactors():Observable<WEWFactor[]>{
		return this.get('/wew/factor').map(factors=>factors.map(factor => WEWFactor.fromJSON(factor)));
	}
	
	//Saves a list of factors and factor classes in them
	public saveFactors(factors:WEWFactor[]):Observable<WEWFactor[]>{
		return this.post('/wew/factor',factors).map(factors=>factors.map(factor => WEWFactor.fromJSON(factor)));
	}
	
	//Checks if all WEW tables are empty
	public areTablesEmpty():Observable<boolean>{
		return this.get('/wew/isEmpty');
	}
	
	//Delete everything from all WEW tables
	public emptyAllTables():Observable<boolean>{
		return this.post('/wew/emptyAll',null);
	}
}
