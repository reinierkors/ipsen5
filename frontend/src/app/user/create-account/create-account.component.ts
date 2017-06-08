import {Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiUserService} from '../api.user.service';
import {User}    from '../user.model';
import {FormGroup, FormBuilder, Validators } from '@angular/forms';
import swal from 'sweetalert2';


@Component({
    providers: [ApiUserService],
    selector: 'create-account-form',
    templateUrl: './create-account.component.html'
})
export class CreateAccountComponent implements OnInit{
    private route:ActivatedRoute;
    private apiUser:ApiUserService;
    public user:User;
    public complexForm : FormGroup;

    constructor(apiUser:ApiUserService,route:ActivatedRoute, fb: FormBuilder){
        this.apiUser = apiUser;
        this.route = route;
        this.complexForm = fb.group({
            'name' : [null, Validators.required],
            'email': [null, Validators.required],
            'password' : [null, Validators.required],
            'group_id' : [1, Validators.required],
        });
    }

    ngOnInit(){
    }

    submitForm(value: any) {
        this.apiUser.createUser(User.fromJSON(value)).subscribe(data => {
            swal('Success...', `Gebruiker ${data.name} aangemaakt!`, 'success');
            this.resetForm();
        }, error => swal('Oops...', error, 'error'));
    }

    resetForm() {
        this.complexForm.reset();
        this.complexForm.clearValidators();
    }

    rollen = [
        {value: 1, viewValue: 'Gebruiker'},
        {value: 2, viewValue: 'Administrator'},
    ];
}
