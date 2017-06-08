import { Component, OnInit } from '@angular/core';
import {ApiUserService} from '../api.user.service';
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
  constructor(userService:ApiUserService) {
      this.userService = userService;
  }

  ngOnInit() {
  }

  editPassword(value: any) {
      this.userService.editPassword(this.model.oldPassword, this.model.newPassword, this.model.confirmPassword).subscribe(data => {
          swal('', `Wachtwoord aangepast!`, 'success');
      }, error => swal('Oops...', error, 'error'));
  }
}
