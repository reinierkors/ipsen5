import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import swal from 'sweetalert2';

import { AuthenticationService } from '../services/auth.service';

@Component({
  selector: 'app-login',
  providers: [AuthenticationService],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  model: any = {};
  constructor(private router: Router, private authenticationService: AuthenticationService) { }

  ngOnInit() {
      this.authenticationService.logout();
  }

    login() {
        this.authenticationService.login(this.model.email, this.model.password)
            .subscribe(() => {
                this.router.navigate(['/home']);
            }, err => swal('Oops...', err.detailMessage, 'error'));
    }
}
