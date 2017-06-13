import { Component, OnInit } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiUserService} from '../api.user.service';
import swal from 'sweetalert2';
import {FormGroup, FormBuilder, Validators } from "@angular/forms";
import {User} from "../user.model";

@Component({
  providers: [ApiUserService],
  selector: 'app-edit-account',
  templateUrl: './edit-account.component.html',
  styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {
    private route: ActivatedRoute;
    private userService: ApiUserService;
    public user:User;
    public complexForm : FormGroup;
    model: any = {};
    currentUser = {

    };
  constructor(userService:ApiUserService, fb: FormBuilder, route: ActivatedRoute) {
      this.userService = userService;
      this.complexForm = fb.group({
          'name' : [null, Validators.required],
          'email': [null, Validators.required],
          'password' : [null, Validators.required],
          'group_id' : [1, Validators.required],
      });
      this.route = route;
  }

    resetForm() {
        this.complexForm.reset();
        this.complexForm.clearValidators();
    }

    ngOnInit() {
        this.userService.getCurrentUser().subscribe(user => {
            this.currentUser = user;
            console.log(user);
        }, error => console.log(error) );
    }

  editPassword(value: any) {
      this.userService.editPassword(this.model.oldPassword, this.model.newPassword, this.model.confirmPassword).subscribe(data => {
          swal('', `Wachtwoord aangepast!`, 'success');
      }, error => swal('Oops...', error, 'error'));
  }

  editAccount(value: any) {

  }
}
