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
	
	public getById(id:number):Observable<Species>{
		return this.get('/species/'+id).map(species=>Species.fromJSON(species));
	}
	
	public getByIds(ids:number[]):Observable<Species[]>{
		return this.get('/species/ids/'+ids.join(',')).map((species:Object[]) => species.map(species=>Species.fromJSON(species)));
	}
	
	public getByNames(names:string[]):Observable<Species[]>{
		return this.post('/species/find',names).map((species:Object[]) => species.map(species=>Species.fromJSON(species)));
	}
	
	public findOrCreate(names:string[]):Observable<Species[]>{
		return this.post('/species/findOrCreate',names).map((species:Object[]) => species.map(species=>Species.fromJSON(species)));
	}
	
	public save(species:Species):Observable<Species>{
		return this.post('/species',species).map(species=>Species.fromJSON(species));
	}
}
