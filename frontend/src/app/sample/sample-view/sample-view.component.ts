import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiSampleService} from '../api.sample.service';
import {Sample} from '../sample.model';
import {ApiSpeciesService} from "../../species/api.species.service";
import {Species} from "../../species/species.model";
import {ApiLocationService} from "../../locations/api.location.service";
import {MarkerLocation} from "../../locations/markerLocation.model";

@Component({
    selector: 'app-sample-view',
    providers: [ApiSampleService, ApiSpeciesService, ApiLocationService],
    templateUrl: './sample-view.component.html',
    styleUrls: ['./sample-view.component.css']
})
export class SampleViewComponent implements OnInit {
    private route: ActivatedRoute;
    private apiSample: ApiSampleService;
    private apiSpecies: ApiSpeciesService;
    private apiLocation: ApiLocationService;
    public sample: Sample;
    public species: Species[];
    public location: MarkerLocation;
    public showChart = false;
    public markerPos;

    constructor(apiSample: ApiSampleService, apiSpecies: ApiSpeciesService, apiLocation: ApiLocationService, route: ActivatedRoute) {
        this.apiSample = apiSample;
        this.apiSpecies = apiSpecies;
        this.apiLocation = apiLocation;
        this.route = route;
    }

    ngOnInit() {
        this.route.params
            .switchMap(params => this.apiSample.getSample(params["id"]))
            .subscribe(sample => {
                this.sample = sample;
                this.retrieveSpecies();
                this.retrieveLocation();
            }, error => console.log(error));
    }

    private retrieveSpecies() {

        this.route.params
            .switchMap(params => this.apiSpecies.getByIds(Array.from(this.sample.speciesValues.keys())))
            .subscribe(species => {
                let names = [];
                let values = [];
                this.species = species;
                this.species.forEach((item) => {
                    names.push(item.name);
                    values.push(this.sample.speciesValues.get(item.id));
                });
                this.option.yAxis.data = names;
                this.option.series[0].data = values;
                // this.option.series[1].data = values;
                this.showChart = true;
            }, error => console.log(error));
    }

    private retrieveLocation() {
        this.route.params
            .switchMap(params => this.apiLocation.getById(this.sample.locationId))
            .subscribe(location => {
                this.location = location;
                this.mapConfig.center = {
                    lat: location.latitude,
                    lng: location.longitude
                };
                this.markerPos = {
                    lat: location.latitude,
                    lng: location.longitude
                };
            }), error => console.log(error);
    }

    // option = {
    //     color: ['#3398DB'],
    //     tooltip: {
    //         trigger: 'axis',
    //         axisPointer: {
    //             type: 'shadow'
    //         }
    //     },
    //     toolbox: {
    //         feature: {
    //             saveAsImage: {}
    //         }
    //     },
    //     grid: {
    //
    //         containLabel: true
    //     },
    //     xAxis: [
    //         {
    //             type: 'category',
    //             data: [],
    //             axisTick: {
    //                 alignWithLabel: true
    //             }
    //         }
    //     ],
    //     yAxis: [
    //         {
    //             type: 'value'
    //         }
    //     ],
    //     series: [
    //         {
    //             name: 'Hoeveelheid',
    //             type: 'bar',
    //             data: []
    //         }
    //     ]
    // };

    option = {
        title: {
            text: 'Aantal beestjes gevonden per monster',
        },
        toolbox: {
            feature: {
                saveAsImage: {}
            }
        },
        tooltip: {
            trigger: 'axis',
            axisPointer: {
                type: 'shadow'
            }
        },
        legend: {
            data: ['Gevonden'] //, 'Referentie'
        },
        grid: {
            left: '3%',
            right: '4%',
            bottom: '3%',
            containLabel: true
        },
        xAxis: {
            type: 'value',
            boundaryGap: [0, 0.01]
        },
        yAxis: {
            type: 'category',
            data: []
        },
        series: [
            {
                name: 'Gevonden',
                type: 'bar',
                data: []
            },
            // {
            //     name: 'Referentie',
            //     type: 'bar',
            //     data: []
            // }
        ]
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
        center: {},
        zoom: 18,
        disableDefaultUI: true,
        clickableIcons: true,
    };
    // options
}
