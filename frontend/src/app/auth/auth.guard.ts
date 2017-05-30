/**
 * Created by Marijn on 23/05/2017.
 */
import { Injectable } from '@angular/core';
import { Router, CanActivate } from '@angular/router';

@Injectable()
export class AuthGuard implements CanActivate {

    constructor(private router: Router) { }

    canActivate() {
        if (localStorage.getItem('currentUser')) {
            let currentUser = JSON.parse(localStorage.getItem('currentUser'));
            if(currentUser.expireDate > Date.now()){
                // logged in and not expired so return true
                return true;
            }
        }

        // not logged in so redirect to login page
        this.router.navigate(['/login']);
        return false;
    }
}
