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

  constructor(public router: Router, private authenticationService: AuthenticationService) {
      this.router.events.subscribe((val) => {
          this.loggedIn = !(localStorage.getItem('currentUser') === null);
      })
  }

  toLogin() {
      this.router.navigate(['/login']);
    }

    toLogout() {
        this.authenticationService.logout().subscribe(()=>{
            this.router.navigate(['/login']);
        });
    }

    loggedIn = !(localStorage.getItem('currentUser') === null);
}

