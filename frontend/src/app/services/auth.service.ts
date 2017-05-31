/**
 * Created by Marijn on 23/05/2017.
 */
import {Inject, Injectable} from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import {ApiService} from '../services/api.service';
import 'rxjs/add/operator/map';

@Injectable()
export class AuthenticationService extends ApiService{
    public token: string;

    constructor(http: Http) {
        super(http);
        // // set token if saved in local storage
        // let currentUser = JSON.parse(localStorage.getItem('currentUser'));
        // this.token = currentUser.token;
    }

    addToStorage(email: string, token: string): void {
        let expireDate = Date.now() + (24*60*60*1000);
        localStorage.setItem('currentUser', JSON.stringify({ email: email, token: token, expireDate: expireDate}));
        this.addToAuthHeaders('Authorization', 'Token ' + token);
    }

    login(email: string, password: string): Observable<boolean> {
        return this.post('/authenticate', { email: email, password: password })
            .map((response: Response) => {
                // login successful if there's a token in the response
                let token = response.toString();
                console.log(token);
                if (token) {
                    // store username and token in local storage to keep user logged in between page refreshes
                    this.addToStorage(email, token);

                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }

    logout(): void {
        // clear token remove user from local storage to log user out
        this.token = null;
        localStorage.removeItem('currentUser');
    }
}
