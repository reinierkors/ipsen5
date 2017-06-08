import { Component, OnInit } from '@angular/core';
import {ApiUserService} from '../api.user.service';
import {MdSnackBar} from '@angular/material';
import swal from 'sweetalert2';

@Component({
  providers: [ApiUserService],
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {
    private userService: ApiUserService;
    model: any = {};
    currentUser = {

    };
  constructor(userService:ApiUserService, public snackBar: MdSnackBar) {
      this.userService = userService;
  }

  ngOnInit() {
  }

  editPassword(value: any) {
      this.userService.editPassword(this.model.oldPassword, this.model.newPassword, this.model.confirmPassword).subscribe(data => {
          this.snackBar.open(`Wachtwoord aangepast!`);
      }, error => swal('Oops...', error, 'error'));
  }
}
