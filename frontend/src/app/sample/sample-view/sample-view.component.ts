import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiSampleService} from '../api.sample.service';
import {Sample} from '../sample.model';
import {ApiTaxonService} from "../../taxon/api.taxon.service";
import {Taxon} from "../../taxon/taxon.model";
import {ApiLocationService} from "../../locations/api.location.service";
import {Location} from "../../locations/location.model";

@Component({
    selector: 'app-sample-view',
    providers: [ApiSampleService, ApiTaxonService, ApiLocationService],
    templateUrl: './sample-view.component.html',
    styleUrls: ['./sample-view.component.css']
})
export class SampleViewComponent implements OnInit {
    private route: ActivatedRoute;
    private apiSample: ApiSampleService;
    private apiTaxon: ApiTaxonService;
    private apiLocation: ApiLocationService;
    public sample: Sample;
    public taxon: Taxon[];
    public location: Location;
    public showChart = false;
    public markerPos;

    constructor(apiSample: ApiSampleService, apiTaxon: ApiTaxonService, apiLocation: ApiLocationService, route: ActivatedRoute) {
        this.apiSample = apiSample;
        this.apiTaxon = apiTaxon;
        this.apiLocation = apiLocation;
        this.route = route;
    }

    ngOnInit() {
        this.route.params
            .switchMap(params => this.apiSample.getSample(params["id"]))
            .subscribe(sample => {
                this.sample = sample
                console.log(sample)
                this.retrieveTaxon();
                this.retrieveLocation();
            }, error => console.log(error));
    }

    private retrieveTaxon() {
		
        this.route.params
            .switchMap(params => this.apiTaxon.getByIds(Array.from(this.sample.taxonValues.keys())))
            .subscribe(taxon => {
                let names = [];
                let values = [];
                this.taxon = taxon;
                this.taxon.forEach((item) => {
                    names.push(item.name);
                    values.push(this.sample.taxonValues.get(item.id));
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
                }
                this.markerPos = {
                    lat: location.latitude,
                    lng: location.longitude
                }
                console.log(this.location)
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
            subtext: 'Vergeleken met wat er verwacht wordt te zijn'
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
