import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiLocationService} from '../api.location.service';
import {Location} from '../location.model';
import {ApiWatertypeService} from '../api.watertype.service';
import {Watertype} from "../watertype.model";
import {ApiWaterschapService} from "../../waterschap/api.waterschap.service";

@Component({
    selector: 'app-results',
    providers: [ApiLocationService, ApiWatertypeService, ApiWaterschapService],
    templateUrl: './results-gmap.component.html',
    styleUrls: ['./results-gmap.component.css']
})
export class ResultsComponent implements OnInit {
    private route: ActivatedRoute;
    private apiLocation: ApiLocationService;
    private apiWatertype: ApiWatertypeService;
    private apiWaterschap: ApiWaterschapService;
    public locations: Location[];
    public mapStyle = [
        {
            elementType: 'labels',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'administrative.country',
            stylers: [
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'administrative.country',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#606060'
                }
            ]
        },
        {
            featureType: 'administrative.locality',
            elementType: 'labels',
            stylers: [
                {
                    visibility: 'simplified'
                }
            ]
        },
        {
            featureType: 'administrative.locality',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#606060'
                }
            ]
        },
        {
            featureType: 'road',
            stylers: [
                {
                    visibility: 'off'
                }
            ]
        },
        {
            featureType: 'water',
            stylers: [
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'water',
            elementType: 'geometry.fill',
            stylers: [
                {
                    color: '#0d9ac7'
                },
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'water',
            elementType: 'labels',
            stylers: [
                {
                    visibility: 'on'
                }
            ]
        },
        {
            featureType: 'water',
            elementType: 'labels.text.fill',
            stylers: [
                {
                    color: '#000000'
                },
                {
                    visibility: 'on'
                }
            ]
        }
    ];

    public mapConfig = {
        styles: this.mapStyle,
        disableDefaultUI: true,
        center: {lat: 52.152832, lng: 5.439478},
        zoom: 8,
    };

    public marker = {
        display: true,
        id: 0,
        code: '',
        description: '',
        lat: null,
        lng: null,
    };

    public watertype = {
        id: 0,
        parentId: 0,
        name: '',
        code: '',
    };

    public parentWatertype = {
        id: 0,
        parentId: 0,
        name: '',
        code: '',
    };

    public waterschap = {
        id: 0,
        name: '',
    };

    positions = [];

    constructor(apiLocation: ApiLocationService, apiWatertype: ApiWatertypeService,
                apiWaterschap: ApiWaterschapService, route: ActivatedRoute) {
        this.apiLocation = apiLocation;
        this.apiWatertype = apiWatertype;
        this.apiWaterschap = apiWaterschap;
        this.route = route;
    };

    ngOnInit() {
        this.route.params
            .switchMap(params => this.apiLocation.getAllLocations())
            .subscribe(markerLocations => {
                this.locations = markerLocations;
                this.initMarkers();
            }, error => console.log(error));
    }

    onClick(event) {
        const map = event.target;
        console.log('markers', map.markers);
        console.log('Lat:', event.latLng.lat());
        console.log('Lng:', event.latLng.lng());
    }

    showMarkerInfo({target: marker}) {
        this.retrieveMarker(marker);
        marker.nguiMapComponent.openInfoWindow('iw', marker);
    }

    retrieveMarker(marker) {
        this.locations.forEach((item) => {
            if (marker.getTitle() === 'm' + <string><any>item.id) {
                this.marker.id = item.id;
                this.marker.code = item.code;
                this.marker.description = item.description;
                this.marker.lat = item.latitude;
                this.marker.lng = item.longitude;
                this.retrieveWatertype(item.watertypeId);
                this.retrieveWaterschap(item.waterschapId);
            }
        });
    }

    retrieveWatertype(id) {
        this.route.params
            .switchMap(params => this.apiWatertype.getWatertype(id))
            .subscribe(watertype => {
                this.watertype = watertype;
                this.retrieveParentWatertype(this.watertype.parentId);
            }, error => console.log(error));
    }

    retrieveParentWatertype(parentId) {
        this.route.params
            .switchMap(params => this.apiWatertype.getWatertype(parentId))
            .subscribe(parent => {
                this.parentWatertype = parent;
            }, error => console.log(error));
    }

    retrieveWaterschap(id) {
        this.route.params.switchMap(params => this.apiWaterschap.getById(id))
            .subscribe(waterschap => {
                this.waterschap = waterschap;
            }, error => console.log(error))
    }

    initMarkers() {
        this.locations.forEach((item) => {
            this.positions.push({
                title: 'm' + <string><any>item.id,
                lat: item.latitude,
                lng: item.longitude
            });
        });
    }
}
