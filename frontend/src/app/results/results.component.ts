import {Component, OnInit} from '@angular/core';
import {NguiMapComponent} from '@ngui/map';


@Component({
    selector: 'app-results',
    templateUrl: './results.component.html',
    styleUrls: ['./results.component.css']
})
export class ResultsComponent {
    message = 'Message works!';
    mapConfig = {
        center: {lat: 52.152832, lng: 5.439478},
        zoom: 8
    };

    positions = [
        {lat: 51.63497, lng: 5.47588, desc: "hi"},
        {lat: 51.50600, lng: 4.78167},
        {lat: 53.03982, lng: 6.81579}
    ];

    onClick(event) {
        const map = event.target;
        console.log("Lat:", event.latLng.lat());
        console.log("Lng:", event.latLng.lng());
        console.log();
    }

    constructor() {
    };
}
