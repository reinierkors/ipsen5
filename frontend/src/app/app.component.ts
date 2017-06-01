import {Component} from '@angular/core';
import { Router } from '@angular/router';
import {AuthenticationService} from "./services/auth.service";

@Component({
  selector: 'app-root',
    providers: [AuthenticationService],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Waterscan';

  constructor(public router: Router, private authenticationService: AuthenticationService) {}

  toLogin() {
      this.router.navigate(['/login']);
      location.reload();
    }

    toLogout() {
        this.authenticationService.logout();
        this.router.navigate(['/login']);
        location.reload();
    }

    loggedIn = !(localStorage.getItem('currentUser') === null);
}

