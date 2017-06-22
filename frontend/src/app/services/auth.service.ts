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
        if(localStorage.getItem("currentUser") != null) {
            if(this.loggedIn() === false) {
                this.logout()
            }
            else {
                let currentUser = JSON.parse(localStorage.getItem("currentUser"));
                ApiService.addToAuthHeaders("X-Authorization", currentUser.token);
            }
        }
        this.userService = new ApiUserService(http);
    }

    addToStorage(token: string): void {
        // Sets an expiration date for the logged in user 24 hours from now
        let expireDate = Date.now() + (24*60*60*1000);

        // Puts the token and expiration date in local storage
        localStorage.setItem('currentUser', JSON.stringify({token: token, expireDate: expireDate}));

        // Creates an auth header for API calls with the token
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
                let token = response.toString();
                if (token) {
                    this.addToStorage(token);
                    this.saveUserRole();
                    return true;
                }
                return false;
            });
    }

    logout(): Observable<boolean>{
        localStorage.removeItem('currentUser');
        localStorage.removeItem('currentUserRole');
        localStorage.removeItem('currentWaterschap');
        return this.post('/authenticate/logout',{})
            .map((response: Response) => {
                return response.ok;
            });
    }

    loggedIn() {
        if (localStorage.getItem('currentUser')) {
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if(currentUser.expireDate > Date.now()){
                return true;
            }
        }
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
