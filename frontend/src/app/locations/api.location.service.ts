import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {ApiService} from '../services/api.service';
import {Location} from './location.model';

@Injectable()
export class ApiLocationService extends ApiService {
    constructor(@Inject(Http) http: Http) {
        super(http);
    }

    public getAllLocations(): Observable<Location[]> {
        return this.get('/location/all').map((markerLocations: Object[]) =>
            markerLocations.map(markerLocation => Location.fromJSON(markerLocation)));
    }
	
	public getByCode(code:string):Observable<Location>{
		return this.get('/location/code/'+code).map(location => Location.fromJSON(location));
	}
	
	public save(location:Location):Observable<Location>{
		return this.post('/location',location).map(location=>Location.fromJSON(location));
	}
}
