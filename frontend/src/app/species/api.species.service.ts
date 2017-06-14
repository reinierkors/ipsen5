import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
import {Species} from './species.model';

@Injectable()
export class ApiSpeciesService extends ApiService{
	constructor(@Inject(Http) http:Http){
		super(http);
	}
	
	//Retrieve a species by its id
	public getById(id:number):Observable<Species>{
		return this.get('/species/'+id).map(species=>Species.fromJSON(species));
	}
	
	//Retrieve a list of species by their ids
	public getByIds(ids:number[]):Observable<Species[]>{
		return this.get('/species/ids/'+ids.join(',')).map((species:Object[]) => species.map(species=>Species.fromJSON(species)));
	}
	
	//Retrieve a list of species by their names
	public getByNames(names:string[]):Observable<Species[]>{
		return this.post('/species/find',names).map((species:Object[]) => species.map(species=>Species.fromJSON(species)));
	}
	
	//Retrieve a list of species by their name, if the species doesn't exist yet it will be created
	public findOrCreate(names:string[]):Observable<Species[]>{
		return this.post('/species/findOrCreate',names).map((species:Object[]) => species.map(species=>Species.fromJSON(species)));
	}
	
	//Save a species to the server
	public save(species:Species):Observable<Species>{
		return this.post('/species',species).map(species=>Species.fromJSON(species));
	}

	//Retrieve all species in db
    public getAll(): Observable<Species[]> {
		return this.get('/species/all').map((species: Object[]) =>
			species.map(species => Species.fromJSON(species)));
	}
}
