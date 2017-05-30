import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs/Observable';

import {ApiService} from '../services/api.service';
import {Watertype} from './watertype.model';

@Injectable()
export class ApiWatertypeService extends ApiService {
    constructor(@Inject(Http) http: Http) {
        super(http);
    }

    public getWatertype(id): Observable<Watertype> {
        return this.get('/watertype/' + id).map(watertype => Watertype.fromJSON(watertype));
    }
}
