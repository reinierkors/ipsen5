import {Inject, Injectable} from '@angular/core';
import {Http, Response, Headers} from '@angular/http';
import {Observable} from 'rxjs';

import {ApiService} from '../services/api.service';
import {User} from './user.model';

@Injectable()
export class ApiUserService extends ApiService{
    constructor(@Inject(Http) http:Http){
        super(http);
    }

    public getUser(id:number):Observable<User>{
        return this.get('/user/'+id).map(user=>User.fromJSON(user));
    }

    public createUser(user:User):Observable<User> {
        console.log("created");
        return this.post('/user/add', user);
    }
}
