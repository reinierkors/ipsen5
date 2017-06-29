import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
import {Waterschap} from './waterschap.model';

@Injectable()
export class ApiWaterschapService extends ApiService {
	constructor(@Inject(Http) http: Http) {
		super(http);
	}

	//Retrieve a waterschap by its ID
	public getById(id): Observable<Waterschap> {
		return this.get('/waterschap/' + id).map((waterschap => Waterschap.fromJSON(waterschap)));
	}

	//Retrieve a list of all waterschappen
	public getAll(): Observable<Waterschap[]> {
		return this.get('/waterschap').map((waterschappen: Object[]) =>
			waterschappen.map(waterschap => Waterschap.fromJSON(waterschap)));
	}

	//Save a waterschap to the server
	public save(waterschap: Waterschap): Observable<Waterschap> {
		console.log(waterschap)
		return this.post('/waterschap/persist', waterschap);
	}
}
