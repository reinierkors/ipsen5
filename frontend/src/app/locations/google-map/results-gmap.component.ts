import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiLocationService} from '../api.location.service';
import {MarkerLocation} from '../markerLocation.model';
import {ApiWatertypeService} from '../../watertype/api.watertype.service';
import {ApiWaterschapService} from "../../waterschap/api.waterschap.service";
import {Watertype} from "../../watertype/watertype.model";
import {Waterschap} from "../../waterschap/waterschap.model";
import {ApiMarkerService} from "../api.marker.service";
import {Marker} from "../marker.model";

@Component({
    selector: 'app-results',
    providers: [ApiLocationService, ApiWatertypeService, ApiWaterschapService, ApiMarkerService],
    templateUrl: './results-gmap.component.html',
    styleUrls: ['./results-gmap.component.css']
})
export class GMapsComponent implements OnInit {
    public markerLocations: MarkerLocation[];
    public positions = [];
    public markers = [];
    public waterschappen = [];
    public watertypes = [];
    public showFilters = false;
    public marker = {
        markerLocation: MarkerLocation,
        watertype: Watertype,
        watertypeKrw: Watertype,
        waterschap: Waterschap,
    };

    public filters = {
        waterschapId: '0',
        watertypeId: '0',
    };

    public mapStyle = [
        {elementType: 'labels', stylers: [{visibility: 'off'}]},
        {featureType: 'administrative.country', stylers: [{visibility: 'on'}]},
        {
            featureType: 'administrative.country',
            elementType: 'labels.text.fill',
            stylers: [{color: '#606060'}]
        },
        {
            featureType: 'administrative.locality', elementType: 'labels',
            stylers: [{visibility: 'simplified'}]
        },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [{color: '#606060'}]
        },
        {featureType: 'road', stylers: [{visibility: 'off'}]},
        {featureType: 'water', stylers: [{visibility: 'on'}]},
        {
            featureType: 'water', elementType: 'geometry.fill',
            stylers: [{color: '#0d9ac7'}, {visibility: 'on'}]
        },
        {
            featureType: 'water', elementType: 'labels',
            stylers: [{visibility: 'on'}]
        },
        {
            featureType: 'water', elementType: 'labels.text.fill',
            stylers: [{color: '#000000'}, {visibility: 'on'}]
        }];

    public mapConfig = {
        styles: this.mapStyle,
        disableDefaultUI: true,
        center: {lat: 52.152832, lng: 5.439478},
        zoom: 8,
    };

    constructor(private apiLocation: ApiLocationService, private apiWatertype: ApiWatertypeService,
                private apiWaterschap: ApiWaterschapService,
                private apiMarker: ApiMarkerService, private route: ActivatedRoute) {

    };

    ngOnInit() {
        this.retrieveLocations();
    };

    public showMarkerInfo({target: marker}) {
        this.retrieveSpecificMarker(marker);
        marker.nguiMapComponent.openInfoWindow('iw', marker);
    };

    private retrieveSpecificMarker(marker) {
        this.markers.forEach((item) => {
            if (marker.getTitle() === 'm' + <string><any>item.markerLocation.id) {
                this.marker = item;
                return;
            }
        });
    };

    public refreshMarkers() {
        this.positions.splice(0);
        this.filters = {
            waterschapId: '0',
            watertypeId: '0',
        };
        this.retrieveLocations();
    };

    private insertIntoPositions(item) {
        this.positions.push({
            title: 'm' + <string><any>item.markerLocation.id,
            lat: item.markerLocation.latitude,
            lng: item.markerLocation.longitude
        });
    }

    private retrieveLocations() {
        this.route.params
            .switchMap(params => this.apiLocation.getAllLocations())
            .subscribe(markerLocations => {
                this.markerLocations = markerLocations;
                this.retrieveWaterschappen();
            }, error => console.log(error));
    };

    private retrieveWaterschappen() {
        this.route.params
            .switchMap(params => this.apiWaterschap.getAll())
            .subscribe(waterschappen => {
                this.waterschappen = waterschappen;
                this.retrieveWatertypes()
            }, error => console.log(error));
    };

    private retrieveWatertypes() {
        this.route.params
            .switchMap(params => this.apiWatertype.getAll())
            .subscribe(watertypes => {
                this.watertypes = watertypes;
                this.createMarkers();
            }, error => console.log(error));
    };

    private createMarkers() {
        this.markerLocations.forEach((markerLocation) => {
            let waterschap: Waterschap;
            let watertype: Watertype;
            let watertypeKrw: Watertype;
            this.waterschappen.forEach((tempWaterschap) => {
                if (tempWaterschap.id == markerLocation.waterschapId && tempWaterschap != undefined) {
                    waterschap = tempWaterschap;
                }
            });
            this.watertypes.forEach((tempWatertype) => {
                if (tempWatertype.id == markerLocation.watertypeId) {
                    watertype = tempWatertype;
                }
                if (tempWatertype.id == markerLocation.watertypeKrwId) {
                    watertypeKrw = tempWatertype;
                }
            });
            this.markers.push({
                markerLocation,
                watertype,
                watertypeKrw,
                waterschap
            },);
            this.insertIntoPositions(this.markers[this.markers.length - 1]);
        });
    }

    public filterMarkers() {
        this.apiMarker.getAllFilteredMarkers(this.filters).subscribe(markers => {
            this.markers = markers;
            this.positions.splice(0);
            this.markers.forEach((item) => {
                this.insertIntoPositions(item);
            });
            console.log(markers);
        }, error => console.log(error));
    };

    public toggleFilters() {
        if (this.showFilters) {
            this.showFilters = false;
            return;
        }
        this.showFilters = true;
    };
}
