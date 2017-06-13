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
	
	//Retrieve a list of taxa by their ids
	public getByIds(ids:number[]):Observable<Taxon[]>{
		return this.post('/taxon/ids/',ids).map(taxa => taxa.map(taxon => Taxon.fromJSON(taxon)));
	}
	
	//Retrieve a list of taxa by their names
	public getByNames(names:string[]):Observable<Taxon[]>{
		return this.post('/taxon/find',names).map(taxa => taxa.map(taxon => Taxon.fromJSON(taxon)));
	}
	
	//Retrieve a list of taxa by their name, if the taxon doesn't exist yet it will be created
	public findOrCreate(names:string[]):Observable<Taxon[]>{
		return this.post('/taxon/findOrCreate',names).map(taxa => taxa.map(taxon => Taxon.fromJSON(taxon)));
	}
	
	//Save list of taxa to the server
	public save(taxa:Taxon[]):Observable<Taxon[]>{
		return this.post('/taxon',taxa).map(taxa => taxa.map(taxon => Taxon.fromJSON(taxon)));
	}
	
	//Save list of taxa to the server
	//When no ID is set, find existing ones by name first and merge with those
	public saveMerge(taxa:Taxon[]):Observable<Taxon[]>{
		return this.post('/taxon/merge',taxa).map(taxa => taxa.map(taxon => Taxon.fromJSON(taxon)));
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
