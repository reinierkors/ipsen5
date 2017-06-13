import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiLocationService} from '../api.location.service';
import {MarkerLocation} from '../markerLocation.model';
import {ApiWatertypeService} from '../../watertype/api.watertype.service';
import {ApiWaterschapService} from "../../waterschap/api.waterschap.service";
import {Watertype} from "../../watertype/watertype.model";
import {Waterschap} from "../../waterschap/waterschap.model";

@Component({
    selector: 'app-results',
    providers: [ApiLocationService, ApiWatertypeService, ApiWaterschapService],
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
            if (marker.getTitle() === 'm' + <string><any>item.markerLocation.id) {
                this.marker = item;
                return;
            }
        });
    };

    public refreshMarkers() {
        this.positions.splice(0);
        this.filters = {
            waterschapName: ' ',
            watertypeName: ' ',
            watertypeCode: ' ',
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

    // private gatherMarkerInfo() {
    //     this.locations.forEach((item) => {
    //         let marker = [];
    //         marker.push(item,);
    //         console.log(item);
    //         // this.retrieveWatertype(marker);
    //     });
    // };

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

    // private retrieveWatertype(marker) {
    //     this.route.params
    //         .switchMap(params => this.apiWatertype.getWatertype(marker[0].watertypeId))
    //         .subscribe(watertype => {
    //             marker.push(watertype);
    //             this.retrieveWatertypeKrw(marker);
    //         }, error => console.log(error));
    // };
    //
    // private retrieveWatertypeKrw(marker) {
    //     this.route.params
    //         .switchMap(params => this.apiWatertype.getWatertype(marker[0].watertypeKrwId))
    //         .subscribe(watertypeKrw => {
    //             marker.push(watertypeKrw);
    //             if (marker[0].waterschapId == null) {
    //                 marker.push({id: 0, name: "Niet bekend"})
    //                 this.addToMarkers(marker)
    //             } else {
    //                 this.retrieveWaterschap(marker);
    //             }
    //         }, error => console.log(error));
    // };
    //
    // private retrieveWaterschap(marker) {
    //     this.route.params.switchMap(params => this.apiWaterschap.getById(marker[0].waterschapId))
    //         .subscribe(waterschap => {
    //             marker.push(waterschap);
    //             this.addToMarkers(marker)
    //         }, error => console.log(error))
    // };

    // private addToMarkers(marker) {
    //     this.markers.push({
    //         markerLocation: marker[0],
    //         watertype: marker[1],
    //         watertypeKrw: marker[2],
    //         waterschap: marker[3],
    //     });
    //     this.insertIntoPositions(this.markers[this.markers.length - 1]);
    //     console.log("Le markers", this.markers);
    // };

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
        this.positions.splice(0);
        this.markers.forEach((item) => {
            let watertypeNameCheck = false;
            let watertypeCodeCheck = false;
            let waterschapCheck = false;

            if (item.watertype.name == this.filters.watertypeName ||
                item.watertypeKrw.name == this.filters.watertypeName ||
                this.filters.watertypeName == (' ') ||
                this.filters.watertypeName == undefined) {
                watertypeNameCheck = true;
            }

            if (item.watertype.code == this.filters.watertypeCode ||
                item.watertypeKrw.code == this.filters.watertypeCode ||
                this.filters.watertypeCode == (' ') ||
                this.filters.watertypeCode == undefined) {
                watertypeCodeCheck = true;
            }

            if (item.waterschap != undefined &&
                item.waterschap.name == this.filters.waterschapName ||
                this.filters.waterschapName == (' ') ||
                this.filters.waterschapName == undefined) {
                waterschapCheck = true;
            }

            if (watertypeNameCheck && watertypeCodeCheck && waterschapCheck)
                this.insertIntoPositions(item);
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
