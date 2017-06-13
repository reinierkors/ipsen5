import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
import {Taxon} from './taxon.model';

@Injectable()
export class ApiTaxonService extends ApiService{
	constructor(@Inject(Http) http:Http){
		super(http);
	}
	
	//Retrieve a taxon by its id
	public getById(id:number):Observable<Taxon>{
		return this.get('/taxon/'+id).map(taxon=>Taxon.fromJSON(taxon));
	}
	
	//Retrieve a list of taxon by their ids
	public getByIds(ids:number[]):Observable<Taxon[]>{
		return this.get('/taxon/ids/'+ids.join(',')).map((taxon:Object[]) => taxon.map(taxon=>Taxon.fromJSON(taxon)));
	}
	
	//Retrieve a list of taxon by their names
	public getByNames(names:string[]):Observable<Taxon[]>{
		return this.post('/taxon/find',names).map((taxon:Object[]) => taxon.map(taxon=>Taxon.fromJSON(taxon)));
	}
	
	//Retrieve a list of taxon by their name, if the taxon doesn't exist yet it will be created
	public findOrCreate(names:string[]):Observable<Taxon[]>{
		return this.post('/taxon/findOrCreate',names).map((taxon:Object[]) => taxon.map(taxon=>Taxon.fromJSON(taxon)));
	}
	
	//Save a taxon to the server
	public save(taxon:Taxon):Observable<Taxon>{
		return this.post('/taxon',taxon).map(taxon=>Taxon.fromJSON(taxon));
	}
}
