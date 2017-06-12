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
	
	//Retrieve a user by its ID
    public getUser(id:number):Observable<User>{
        return this.get('/user/'+id).map(user=>User.fromJSON(user));
    }
	
	//Save a user to the server
    public createUser(user:User):Observable<User> {
        return this.post('/user/add', user);
    }
	
	//Change the current users password
    public editPassword(oldPassword: String, newPassword: String, confirmPassword: String):Observable<boolean> {
        return this.post('/user/editpassword', {oldPassword: oldPassword, newPassword: newPassword, confirmPassword: confirmPassword});
    }
}
