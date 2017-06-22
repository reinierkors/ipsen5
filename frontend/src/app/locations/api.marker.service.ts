import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {ApiService} from '../services/api.service';
import {Marker} from "app/locations/marker.model";

@Injectable()
export class ApiMarkerService extends ApiService {
    constructor(@Inject(Http) http: Http) {
        super(http);
    }

    //Retrieve a list of filtered markers
    public getAllFilteredMarkers(markerFilter:Object): Observable<Marker[]> {
        return this.post('/markers/filter', markerFilter).map((markers: Object[]) =>
            markers.map(marker => Marker.fromJSON(marker)));
    }
}
