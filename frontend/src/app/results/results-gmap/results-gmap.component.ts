import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiLocationService} from '../api.location.service';
import {Location} from '../location.model';
import {ApiWatertypeService} from '../api.watertype.service';
import {ApiWaterschapService} from "../../waterschap/api.waterschap.service";
import {Watertype} from "../watertype.model";
import {Waterschap} from "../../waterschap/waterschap.model";

@Component({
    selector: 'app-results',
    providers: [ApiLocationService, ApiWatertypeService, ApiWaterschapService],
    templateUrl: './results-gmap.component.html',
    styleUrls: ['./results-gmap.component.css']
})
export class ResultsComponent implements OnInit {
    public locations: Location[];
    public positions = [];
    public markers = [];
    public filteredMarkers = [];
    public waterschappen = [];
    public watertypes = [];
    public showFilters = false;

    public marker = {
        location: Location,
        watertype: Watertype,
        parentWatertype: Watertype,
        waterschap: Waterschap
    };

    public filters = {
        waterschapName: ' ',
        watertypeName: ' ',
        watertypeCode: ' ',
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
                private apiWaterschap: ApiWaterschapService, private route: ActivatedRoute) {
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
            if (marker.getTitle() === 'm' + <string><any>item.location.id) {
                this.marker = item;
                console.log(this.marker)
            }
        });
    };

    public refreshMarkers() {
        this.positions.splice(0);
        this.retrieveFilterList();
        this.markers.forEach((item) => {
            this.insertIntoPositions(item);
        });
    };

    private retrieveFilterList() {
        this.waterschappen = [];
        this.watertypes = [];
        this.retrieveWatertypes();
        this.retrieveWaterschappen();
    }
    private insertIntoPositions(item) {
        this.positions.push({
            title: 'm' + <string><any>item.location.id,
            lat: item.location.latitude,
            lng: item.location.longitude
        });
    }

    private gatherMarkerInfo() {
        this.locations.forEach((item) => {
            let marker = [];
            marker.push(item,);
            this.retrieveWatertype(marker);
        });
    };

    private retrieveLocations() {
        this.route.params
            .switchMap(params => this.apiLocation.getAllLocations())
            .subscribe(markerLocations => {
                this.locations = markerLocations;
                this.gatherMarkerInfo();
            }, error => console.log(error));
    };

    private retrieveWatertypes() {
        this.route.params
            .switchMap(params => this.apiWatertype.getAllTypes())
            .subscribe(watertypes => {
                this.watertypes = watertypes;
            }, error => console.log(error));
    };

    private retrieveWaterschappen() {
        this.route.params
            .switchMap(params => this.apiWaterschap.getAll())
            .subscribe(waterschappen => {
                this.waterschappen = waterschappen;
            }, error => console.log(error));
    };

    private retrieveWatertype(marker) {
        this.route.params
            .switchMap(params => this.apiWatertype.getWatertype(marker[0].watertypeId))
            .subscribe(watertype => {
                marker.push(watertype);
                this.retrieveParentWatertype(marker);
            }, error => console.log(error));
    };

    private retrieveParentWatertype(marker) {
        this.route.params
            .switchMap(params => this.apiWatertype.getWatertype(marker[1].parentId))
            .subscribe(parent => {
                marker.push(parent);
                this.retrieveWaterschap(marker);
            }, error => console.log(error));//TODO: ERROR WHEN NULL
    };

    private retrieveWaterschap(marker) {
        this.route.params.switchMap(params => this.apiWaterschap.getById(marker[0].waterschapId))
            .subscribe(waterschap => {
                marker.push(waterschap);
                this.addToMarkers(marker)
            }, error => console.log(error))
    };

    private addToMarkers(marker) {
        this.markers.push({
            location: marker[0],
            watertype: marker[1],
            parentWatertype: marker[2],
            waterschap: marker[3],
        });
        this.insertIntoPositions(this.markers[this.markers.length - 1]);
        this.retrieveFilterList();
        console.log("Le markers", this.markers);
    };

    public filterMarkers() {
        this.positions.splice(0);
        this.markers.forEach((item) => {
            if ((item.waterschap.name == this.filters.waterschapName ||
                this.filters.waterschapName == (' ') ||
                this.filters.waterschapName == undefined) &&
                (item.watertype.name == this.filters.watertypeName ||
                item.parentWatertype.name == this.filters.watertypeName ||
                this.filters.watertypeName == (' ') ||
                this.filters.watertypeName == undefined) &&
                (item.watertype.code == this.filters.watertypeCode ||
                item.parentWatertype.code == this.filters.watertypeCode ||
                this.filters.watertypeCode == (' ') ||
                this.filters.watertypeCode == undefined)) {
                this.insertIntoPositions(item)
            }
        });

    };

    public toggleFilters() {
        if (this.showFilters) {
            this.showFilters = false;
            return;
        }
        this.showFilters = true;
    };
}
