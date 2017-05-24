import {Component, OnInit} from '@angular/core';
import {NguiMapComponent} from '@ngui/map';
import {ActivatedRoute} from "@angular/router";
import {ApiLocationService} from '../api.location.service';
import {Location} from '../location.model';

@Component({
    selector: 'app-results',
    providers: [ApiLocationService],
    templateUrl: './results-gmap.component.html',
    styleUrls: ['./results-gmap.component.css']
})
export class ResultsComponent implements OnInit {
    private route: ActivatedRoute;
    private apiLocation: ApiLocationService;
    public locations: Location[];

    constructor(apiLocation: ApiLocationService, route: ActivatedRoute) {
        this.apiLocation = apiLocation;
        this.route = route;
        this.initMarkers();
    };

    ngOnInit() {
        this.route.params
            .switchMap(params => this.apiLocation.getAllLocations())
            .subscribe(markerLocations => this.locations = markerLocations, error => console.log(error));
    }

    mapConfig = {
        center: {lat: 52.152832, lng: 5.439478},
        zoom: 8
    };

    marker = {
        display: true,
        id: "",
        lat: null,
        lng: null,
        desc: "",
    };

    markers = [
        {
            display: true,
            id: "mrk0",
            lat: 51.63497,
            lng: 5.47588,
            desc: "Dit is water 1"
        },
        {
            display: true,
            id: "mrk1",
            lat: 51.50600,
            lng: 4.78167,
            desc: "Dit is water 2"
        },
        {
            display: true,
            id: "mrk2",
            lat: 53.03982,
            lng: 6.81579,
            desc: "Dit is water 3"
        }
    ];

    positions = [];

    onClick(event) {
        const map = event.target;
        console.log("markers", map.markers);
        console.log("Lat:", event.latLng.lat());
        console.log("Lng:", event.latLng.lng());
    }

    showMarkerInfo({target: marker}) {
        console.log("Le marker:", marker);
        this.retrieveMarker(marker);
        marker.nguiMapComponent.openInfoWindow('iw', marker);
    }

    retrieveMarker(marker) {
        this.markers.forEach((item) => {
            if (marker.getTitle() == item.id) {
                this.marker = item;
            }
        });
    }

    initMarkers() {
        this.markers.forEach((item) => {
            this.positions.push({lat: item.lat, lng: item.lng})
        });
    }
}
