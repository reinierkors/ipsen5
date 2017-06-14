import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {ApiService} from '../services/api.service';
import {MarkerLocation} from './markerLocation.model';

@Injectable()
export class ApiLocationService extends ApiService {
    constructor(@Inject(Http) http: Http) {
        super(http);
    }
	
	//Retrieve a list of all locations
    public getAllLocations(): Observable<MarkerLocation[]> {
        return this.get('/location/all').map((markerLocations: Object[]) =>
            markerLocations.map(markerLocation => MarkerLocation.fromJSON(markerLocation)));
    }
	
	//Retrieve a location by its ID
    public getById(id): Observable<MarkerLocation> {
        return this.get('/location/id/'+id).map(markerLocation => MarkerLocation.fromJSON(markerLocation));
    }
	
	//Retrieve a location by its code
	public getByCode(code:string):Observable<MarkerLocation>{
		return this.get('/location/code/'+code).map(markerLocation => MarkerLocation.fromJSON(markerLocation));
	}
	
	//Sae a location to the server
	public save(markerLocation:MarkerLocation):Observable<MarkerLocation>{
		return this.post('/location',markerLocation).map(markerLocation=>MarkerLocation.fromJSON(markerLocation));
	}
}
