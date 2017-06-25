import {Inject,Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
import {Reference} from './reference.model';
import {SimpleWEWValue} from '../wew/wew.model';

@Injectable()
export class ApiReferenceService extends ApiService{
	constructor(@Inject(Http) http:Http){
		super(http);
	}
	
	//Retrieve all references
	public getAll():Observable<Reference[]>{
		return this.get('/reference').map(references => references.map(reference => Reference.fromJSON(reference)));
	}
	
	//Retrieve a reference by its id
	public getReference(id:number):Observable<Reference>{
		return this.get('/reference/'+id).map(reference=>Reference.fromJSON(reference));
	}
	
	//Retrieve a reference by its watertype
	public getByWatertype(watertypeId:number):Observable<Reference>{
		return this.get('/reference/watertype/'+watertypeId).map(reference=>Reference.fromJSON(reference));
	}
	
	//Save a reference to the server
	public save(reference:Reference):Observable<Reference>{
		return this.post('/admin/reference',reference).map(reference => Reference.fromJSON(reference));
	}
	
	//Deletes a reference and all its calculations
	public delete(id:number):Observable<boolean>{
		return this.post('/admin/reference/delete/'+id,null);
	}
	
	//Get a list of calculations for the given reference id
	public getCalculationsByReference(referenceId:number):Observable<SimpleWEWValue[]>{
		return this.get('/calculate/reference/'+referenceId).map(objs => objs.map(obj => {
			let value = new SimpleWEWValue();
			value.factorClassId = obj.factorClassId;
			value.value = obj.computedValue;
			return value;
		}));
	}
}
