import {Component, OnInit} from '@angular/core';
import {NguiMapComponent} from '@ngui/map';


@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.css']
})
export class ResultsComponent {
    message = 'Message works!';
    center = 'Leiden, The Netherlands';

    positions = [
        {lat: 51.63497, lng: 5.47588},
        {lat: 51.50600, lng: 4.78167},
        {lat: 53.03982, lng: 6.81579}
    ];

    onClick(event) {
        if (event instanceof MouseEvent) {
            return false;
        }
        console.log('map is clicked', event, event.target);
    }

    constructor() {
    };
}
