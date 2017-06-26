import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
import {Taxon,TaxonGroup,TaxonLevel} from './taxon.model';

@Injectable()
export class ApiTaxonService extends ApiService{
	constructor(@Inject(Http) http:Http){
		super(http);
	}
	
	//Retrieve a taxon by its id
	public getById(id:number):Observable<Taxon>{
		return this.get('/taxon/'+id).map(taxon => Taxon.fromJSON(taxon));
	}
	
	//Retrieve a list of taxonIds by their ids
	public getByIds(ids:number[]):Observable<Taxon[]>{
		return this.post('/taxon/ids',ids).map(taxonIds => taxonIds.map(taxon => Taxon.fromJSON(taxon)));
	}
	
	//Retrieve all species in db
	public getAll():Observable<Taxon[]> {
		return this.get('/taxon/all').map(taxonIds => taxonIds.map(taxon => Taxon.fromJSON(taxon)));
	}
	
	//Retrieve a taxon and all its ancestors and descendants
	public getFamily(id:number):Observable<Taxon[]> {
		return this.get('/taxon/family/'+id).map(taxonIds => taxonIds.map(taxon => Taxon.fromJSON(taxon)));
	}
	
	//Retrieve a list of taxonIds by their names
	public getByNames(names:string[]):Observable<Taxon[]>{
		return this.post('/taxon/find',names).map(taxonIds => taxonIds.map(taxon => Taxon.fromJSON(taxon)));
	}
	
	//Retrieve a list of taxonIds by their name, if the taxon doesn't exist yet it will be created
	public findOrCreate(names:string[]):Observable<Taxon[]>{
		return this.post('/taxon/findOrCreate',names).map(taxonIds => taxonIds.map(taxon => Taxon.fromJSON(taxon)));
	}
	
	//Save list of taxonIds to the server
	public save(taxonIds:Taxon[]):Observable<Taxon[]>{
		return this.post('/taxon',taxonIds).map(taxonIds => taxonIds.map(taxon => Taxon.fromJSON(taxon)));
	}
	
	//Save list of taxonIds to the server
	//When no ID is set, find existing ones by name first and merge with those
	public saveMerge(taxonIds:Taxon[]):Observable<Taxon[]>{
		return this.post('/taxon/merge',taxonIds).map(taxonIds => taxonIds.map(taxon => Taxon.fromJSON(taxon)));
	}
	
	//Retrieve list of all taxon groups
	public getGroups():Observable<TaxonGroup[]>{
		return this.get('/taxon/group').map(groups => groups.map(group => TaxonGroup.fromJSON(group)));
	}
	
	//Save list of groups to the server
	public saveGroups(groups:TaxonGroup[]):Observable<TaxonGroup[]>{
		return this.post('/taxon/group',groups).map(groups => groups.map(group => TaxonGroup.fromJSON(group)));
	}
	
	//Retrieve list of all taxon levels
	public getLevels():Observable<TaxonLevel[]>{
		return this.get('/taxon/level').map(levels => levels.map(level => TaxonLevel.fromJSON(level)));
	}
	
	//save list of taxon levels to the server
	public saveLevels(levels:TaxonLevel[]):Observable<TaxonLevel[]>{
		return this.post('/taxon/level',levels).map(levels => levels.map(level => TaxonLevel.fromJSON(level)));
	}
}
