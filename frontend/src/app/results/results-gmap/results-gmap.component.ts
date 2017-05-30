import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiLocationService} from '../api.location.service';
import {Location} from '../location.model';
import {ApiWatertypeService} from '../api.watertype.service';

@Component({
    selector: 'app-results',
    providers: [ApiLocationService, ApiWatertypeService],
    templateUrl: './results-gmap.component.html',
    styleUrls: ['./results-gmap.component.css']
})
export class ResultsComponent implements OnInit {
    private route: ActivatedRoute;
    private apiLocation: ApiLocationService;
    private apiWatertype: ApiWatertypeService;
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

    positions = [];

    constructor(apiLocation: ApiLocationService, apiWatertype: ApiWatertypeService, route: ActivatedRoute) {
        this.apiLocation = apiLocation;
        this.apiWatertype = apiWatertype;
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
                this.retrieveWatertype(item.id)
            }
        });
    }

    retrieveWatertype(id) {
        this.route.params
            .switchMap(params => this.apiWatertype.getWatertype(id))
            .subscribe(watertype => {
                this.watertype = watertype;
            }, error => console.log(error));
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
