import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

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
}
