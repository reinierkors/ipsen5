import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
import {Sample} from './sample.model';
import {Taxon} from '../taxon/taxon.model';
import {SimpleWEWValue} from '../wew/wew.model';

@Injectable()
export class ApiSampleService extends ApiService {
    constructor(@Inject(Http) http: Http) {
        super(http);
    }

    //Retrieve a sample by its id
    public getSample(id: number): Observable<Sample> {
        return this.get('/sample/' + id).map(sample => Sample.fromJSON(sample));
    }

    //Save a sample to the server
    public save(sample: Sample): Observable<Sample> {
        return this.post('/sample', [sample]).map(samples => Sample.fromJSON(samples[0]));
    }

    //Save a list of samples to the server
    public saveMulti(samples: Sample[]): Observable<Sample[]> {
        return this.post('/sample', samples).map(samples => samples.map(sample => Sample.fromJSON(sample)));
    }

    //Get a list of calculations for the given sample id
    public getCalculationsBySample(sampleId: number):Observable<SimpleWEWValue[]>{
        return this.get('/calculate/sample/'+sampleId).map(objs => objs.map(obj => {
			let value = new SimpleWEWValue();
			value.factorClassId = obj.factorClassId;
			value.value = obj.computedValue;
			return value;
		}));
    }

    public getByLocationId(locationId: number): Observable<Sample[]> {
        return this.get('/sample/getRelevant/' + locationId).map(samples => samples.map(sample => Sample.fromJSON(sample)));
    }

    public getByDate(date: string): Observable<Sample[]> {
        return this.get('/sample/date/' + date).map(samples => samples.map(sample => Sample.fromJSON(sample)));
    }

    public getDistinctYears(): Observable<String[]> {
        return this.get('/sample/getYears/');
    }
	
	public getRecent(count:number):Observable<Sample[]>{
		return this.get('/sample/recent/'+count).map(samples => samples.map(sample => Sample.fromJSON(sample)));
	}
	
	public delete(id:number):Observable<boolean>{
		return this.post('/admin/sample/delete',id);
	}
}
