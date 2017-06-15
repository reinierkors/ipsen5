import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiSampleService} from '../../sample/api.sample.service';
import {ApiLocationService} from '../../locations/api.location.service';
import {Sample} from '../../sample/sample.model';

@Component({
    selector: 'app-waters',
    providers: [ApiSampleService, ApiLocationService],
    templateUrl: './waters.component.html',
    styleUrls: ['./waters.component.css']
})
export class WatersComponent implements OnInit {
    private route: ActivatedRoute;
    private apiSample: ApiSampleService;
    private apiLocation: ApiLocationService;
    public currentLocation: {};
    public sample: Sample;
    public samples: Sample[];
    public selected = 0;

    sampleRows = [];
    sampleColums = [
        {name: 'Datum', prop: 'date'}, // Moet alleen nog ff formatten naar dag / maand / jaar
        {name: 'Eigennaar', prop: 'owner_id'}, // Niet nodig voor gebruiker
        {name: 'Kwaliteit', prop: 'quality'},
        {name: 'X_coor', prop: 'xCoor'}, // Niet nodig voor gebruiker
        {name: 'Y_coor', prop: 'yCoor'} // Niet nodig voor gebruiker
    ];

    constructor(apiSample: ApiSampleService, apiLocation: ApiLocationService, route: ActivatedRoute) {
        this.apiLocation = apiLocation;
        this.apiSample = apiSample;
        this.route = route;
    }

    ngOnInit() {
        this.getCurrentLocation();
    }

    private getCurrentLocation() {
        this.route.params
            .switchMap(params => this.apiLocation.getById(params['id']))
            .subscribe(location => {
                this.currentLocation = location;
                console.log(this.currentLocation);
                this.getSamples();
            }, error => console.log(error));
    };

    private getSamples() {
        this.route.params
            .switchMap(params => this.apiSample.getByLocationId(params['id']))
            .subscribe(samples => {
                this.sampleRows = samples;
                this.samples = samples;
                console.log(this.samples);
            }, error => console.log(error));
    };

    onSelect(selected) {
        console.log(selected);
        this.selected = selected.row.id;
    }
}
