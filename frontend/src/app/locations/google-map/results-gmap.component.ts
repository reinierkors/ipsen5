import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiLocationService} from '../api.location.service';
import {MarkerLocation} from '../markerLocation.model';
import {ApiWatertypeService} from '../../watertype/api.watertype.service';
import {ApiWaterschapService} from "../../waterschap/api.waterschap.service";
import {Watertype} from "../../watertype/watertype.model";
import {Waterschap} from "../../waterschap/waterschap.model";
import {ApiMarkerService} from "../api.marker.service";
import {ApiSampleService} from "../../sample/api.sample.service";

@Component({
    selector: 'app-results',
    providers: [ApiLocationService, ApiWatertypeService, ApiWaterschapService, ApiMarkerService, ApiSampleService],
    templateUrl: './results-gmap.component.html',
    styleUrls: ['./results-gmap.component.css']
})
export class GMapsComponent implements OnInit {
    public positions = [];
    public markers = [];
    public watertypes = [];
    public waterschappen = [];
    public showFilters = false;
    public marker = {
        markerLocation: MarkerLocation,
        watertype: Watertype,
        watertypeKrw: Watertype,
        waterschap: Waterschap,
        lastTakenSample: String,
    };
    public filterYears = [];

    public filters = {
        waterschapId: '0',
        watertypeId: '0',
        date: '',
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
        disableDefaultUI: false,
        center: {lat: 52.152832, lng: 5.439478},
        zoom: 8,
    };

    constructor(private apiWatertype: ApiWatertypeService,
                private apiWaterschap: ApiWaterschapService,
                private apiMarker: ApiMarkerService,
                private apiSample: ApiSampleService,
                private route: ActivatedRoute) {
    };

    ngOnInit() {
        this.retrieveMarkers();
    };

    public showMarkerInfo({target: marker}) {
        this.retrieveSpecificMarker(marker);
        marker.nguiMapComponent.openInfoWindow('iw', marker);
    };

    private retrieveSpecificMarker(marker) {
        this.markers.forEach((item) => {
            if (marker.getTitle() === 'm' + item.markerLocation.id) {
                this.marker = item;
                return;
            }
        });
    };

    public retrieveMarkers() {
        this.apiMarker.getAllFilteredMarkers(this.filters).subscribe(markers => {
            this.markers = markers;
            this.positions.splice(0);
            this.markers.forEach((item) => {
                this.insertIntoPositions(item);
            });
            this.retrieveWaterschappen();
            this.retrieveWatertypes();
            this.retrieveFilterYears();
        }, error => console.log(error));
    };

    public refreshMarkers() {
        this.positions.splice(0);
        this.filters = {
            waterschapId: '0',
            watertypeId: '0',
            date: '',
        };
        this.retrieveMarkers();
    };

    private retrieveWaterschappen() {
        this.route.params
            .switchMap(params => this.apiWaterschap.getAll())
            .subscribe(items => {
                this.waterschappen = items;
            }, error => console.log(error));
    };

    private retrieveWatertypes() {
        this.route.params
            .switchMap(params => this.apiWatertype.getAll())
            .subscribe(items => {
                this.watertypes = items;
            }, error => console.log(error));
    };

    private retrieveFilterYears() {
        this.route.params
            .switchMap(params => this.apiSample.getDistinctYears())
            .subscribe(items => {
                this.filterYears = items;
            }, error => console.log(error));
    }

    private insertIntoPositions(item) {
        this.positions.push({
            title: 'm' + <string><any>item.markerLocation.id,
            lat: item.markerLocation.latitude,
            lng: item.markerLocation.longitude
        });
    }

    public toggleFilters() {
        if (this.showFilters) {
            this.showFilters = false;
            return;
        }
        this.showFilters = true;
    };
}
