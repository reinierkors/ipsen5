/**
 * Created by Marijn on 23/05/2017.
 */
import {Inject, Injectable} from '@angular/core';
import { Http, Headers, Response } from '@angular/http';
import { Observable } from 'rxjs';
import {ApiService} from '../services/api.service';
import 'rxjs/add/operator/map';
import {ApiUserService} from "../user/api.user.service";

@Injectable()
export class AuthenticationService extends ApiService{
    private userService: ApiUserService;

    constructor(http: Http) {
        super(http);
        if(localStorage.getItem("currentUser") != null){
            let currentUser = JSON.parse(localStorage.getItem("currentUser"));
            ApiService.addToAuthHeaders("X-Authorization", currentUser.token);
        }
        this.userService = new ApiUserService(http);
    }

    addToStorage(token: string): void {
        let expireDate = Date.now() + (24*60*60*1000);
        localStorage.setItem('currentUser', JSON.stringify({token: token, expireDate: expireDate}));
        ApiService.addToAuthHeaders('X-Authorization', token);
    }

    saveUserRole(){
        this.userService.getCurrentUser().subscribe(user => {
            let currentUser = user;
            localStorage.setItem('currentUserRole', JSON.stringify({role: user.group_id}));
            localStorage.setItem('currentWaterschap', JSON.stringify({waterschapid: user.waterschap_id}));
        }, error => console.log(error));
    }

    login(email: string, password: string): Observable<boolean> {
        return this.post('/authenticate/login', { email: email, password: password })
            .map((response: Response) => {
                // login successful if there's a token in the response
                let token = response.toString();
                if (token) {
                    // store username and token in local storage to keep user logged in between page refreshes
                    this.addToStorage(token);

                    this.saveUserRole();
                    // return true to indicate successful login
                    return true;
                } else {
                    // return false to indicate failed login
                    return false;
                }
            });
    }

    logout(): Observable<boolean>{
        // remove user from local storage to log user out
        localStorage.removeItem('currentUser');
        return this.post('/authenticate/logout',{})
            .map((response: Response) => {
                return response.ok;
            });
    }

    loggedIn() {
        if (localStorage.getItem('currentUser')) {
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if(currentUser.expireDate > Date.now()){
                // logged in and not expired so return true
                return true;
            }
        }

        // not logged in so redirect to login page
        return false;
    }

    isAdmin() {
        if (localStorage.getItem('currentUserRole')){
            let currentUserRole = JSON.parse(localStorage.getItem('currentUserRole'));
            if(currentUserRole.role === 2){
                // user is admin
                return true;
            }
            // user is not an admin
            return false;
        }
    }
}
