import {Component, OnInit} from '@angular/core';

import {User}    from '../user';


@Component({
    selector: 'create-account-form',
    templateUrl: './create-account.component.html'
})
export class CreateAccountComponent implements OnInit {

    rollen = [
        {value: 1, viewValue: 'Gebruiker'},
        {value: 2, viewValue: 'Administrator'},
    ];

    constructor() {
    }

    ngOnInit() {
    }

    model = new User(1, 'reinierkors@hotmail.com', 'wachtwoord', 'Reinier', 1);
    submitted = false;

    onSubmit() {
        this.submitted = true;
    }

    // TODO: Remove this when we're done
    get diagnostic() {
        return JSON.stringify(this.model);
    }
}
