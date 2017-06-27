import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiUserService} from '../api.user.service';
import {User}    from '../user.model';
import {FormGroup, FormBuilder, Validators} from '@angular/forms';
import swal from 'sweetalert2';
import {ApiWaterschapService} from "../../waterschap/api.waterschap.service";
import {Waterschap} from "../../waterschap/waterschap.model";
import {error} from "util";


@Component({
    providers: [ApiUserService, ApiWaterschapService],
    selector: 'create-account-form',
    templateUrl: './create-account.component.html'
})
export class CreateAccountComponent implements OnInit {
    private route: ActivatedRoute;
    private apiUser: ApiUserService;
    private apiWaterschap: ApiWaterschapService;
    public user: User;
    public complexForm: FormGroup;
    public waterschapForm: FormGroup;
    public waterschappen: Waterschap[];
    public isNull = null;

    constructor(apiUser: ApiUserService, route: ActivatedRoute, apiWaterschap: ApiWaterschapService,
                fb: FormBuilder) {
        this.apiUser = apiUser;
        this.apiWaterschap = apiWaterschap;
        this.route = route;
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'email': [null, Validators.required],
            'password': [null, Validators.required],
            'group_id': [1, Validators.required],
            'waterschap_id': [null, Validators.required]
        });
        this.waterschapForm = fb.group({
            'name': [null, Validators.required],
            'address': [],
            'houseNumber': [],
            'zipCode': [],
            'location': [],
            'phoneNumber': [],
        });
    }

    ngOnInit() {
        this.retrieveWaterschappen(false);
    }

    submitForm(value: any) {
        this.apiUser.createUser(User.fromJSON(value)).subscribe(data => {
            swal('', `Gebruiker ${data.name} aangemaakt!`, 'success');
            this.resetForm();
        }, error => swal('Oops...', error.detailMessage, 'error'));
    }

    resetForm() {
        this.complexForm.reset();
        this.complexForm.clearValidators();
    }

    rollen = [
        {value: 1, viewValue: 'Gebruiker'},
        {value: 2, viewValue: 'Administrator'},
    ];

    submitWaterschapForm(value: any) {
        this.apiWaterschap.save(Waterschap.fromJSON(value)).subscribe(data => {
            swal('', `Waterschap ${data.name} aangemaakt!`, 'success');
            this.resetWaterschapForm();
        }, error => swal('Oops...', error.detailMessage, 'error'));
    }

    retrieveWaterschappen(selectLast: boolean) {
        this.apiWaterschap.getAll().subscribe(waterschappen => {
            this.waterschappen = waterschappen;
            if (selectLast)
                this.complexForm.patchValue({'waterschap_id': this.waterschappen[this.waterschappen.length - 1].id});
        }), error => swal('Oops...', error.detailMessage, 'error');
    }

    resetWaterschapForm() {
        this.waterschapForm.reset();
        this.retrieveWaterschappen(true);
    }
}
