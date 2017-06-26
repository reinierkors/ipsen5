import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiUserService} from '../api.user.service';
import swal from 'sweetalert2';
import {FormGroup, FormBuilder, Validators} from "@angular/forms";
import {User} from "../user.model";
import {ApiWaterschapService} from "../../waterschap/api.waterschap.service";
import {Waterschap} from "../../waterschap/waterschap.model";

@Component({
    providers: [ApiUserService, ApiWaterschapService],
    selector: 'app-edit-account',
    templateUrl: './edit-account.component.html',
    styleUrls: ['./edit-account.component.css']
})
export class EditAccountComponent implements OnInit {
    private route: ActivatedRoute;
    private userService: ApiUserService;
    private apiWaterschap: ApiWaterschapService;
    public user: User;
    public complexForm: FormGroup;
    public waterschapForm: FormGroup;

    public model: any = {};
    public currentUser: User;
    public waterschap: Waterschap;

    constructor(userService: ApiUserService, fb: FormBuilder, apiWaterschap: ApiWaterschapService, route: ActivatedRoute) {
        this.userService = userService;
        this.apiWaterschap = apiWaterschap;
        this.complexForm = fb.group({
            'name': [null, Validators.required],
            'email': [null, Validators.required]
        });
        this.waterschapForm = fb.group({
            'name': [null, Validators.required],
            'address': [null],
            'houseNumber': [null],
            'zipCode': [null],
            'location': [null],
            'phoneNumber': [null],
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
            if (user.waterschap_id != undefined)
                this.retrieveWaterschap(user.waterschap_id);
        }, error => console.log(error));
    }

    editPassword(value: any) {
        this.userService.editPassword(this.model.oldPassword, this.model.newPassword, this.model.confirmPassword).subscribe(data => {
            swal('', `Wachtwoord aangepast!`, 'success');
        }, error => swal('Oops...', error.detailMessage, 'error'));
    }

    editAccount() {
        this.userService.editUser(User.fromJSON(this.currentUser)).subscribe(data => {
            swal('', `Gebruiker ${data.name} aangepast!`, 'success');
            // this.resetForm();
            // Ik zou geen resetform doen aangezien hij hem dan terug zet naar lege waardes in plaats van nieuwe waardes
        }, error => swal('Oops...', error.detailMessage, 'error'));
    }

    submitWaterschapForm() {
        this.apiWaterschap.save(Waterschap.fromJSON(this.waterschap)).subscribe(data => {
            swal('', `Waterschap ${data.name} gewijzigd!`, 'success');
        }, error => swal('Oops...', error.detailMessage, 'error'));
    }

    retrieveWaterschap(id) {
        this.apiWaterschap.getById(id).subscribe(waterschap => {
            this.waterschap = waterschap;
        }), error => swal('Oops...', error.detailMessage, 'error');
    }
}
