import {Inject,Injectable} from '@angular/core';
import {Http} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
import {Reference} from './reference.model';

//Value that is calculated in a reference using the WEW list
export type CalculationData = {factorClassId:number,computedValue:number};

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
	
	//Save a reference to the server
	public save(reference:Reference):Observable<Reference>{
		return this.post('/admin/reference',reference).map(reference => Reference.fromJSON(reference));
	}
	
	//Deletes a reference and all its calculations
	public delete(id:number):Observable<boolean>{
		return this.post('/admin/reference/delete/'+id,null);
	}
	
	//Get a list of calculations for the given reference id
	public getCalculationsByReference(referenceId:number):Observable<CalculationData[]>{
		return this.get('/calculate/reference/'+referenceId);
	}
}
