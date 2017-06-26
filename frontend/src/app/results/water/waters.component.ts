import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiSampleService} from '../../sample/api.sample.service';
import {ApiLocationService} from '../../locations/api.location.service';
import {Sample} from '../../sample/sample.model';
import {DatatableComponent} from "@swimlane/ngx-datatable";

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
    public samples: Sample[];

    @ViewChild('sampleDetailsTemplate') sampleDetailsTemplate;
    @ViewChild(DatatableComponent) table: DatatableComponent;

    sampleRows = [];
    sampleColumns = [
        {name: 'Datum', prop: 'date', cellTemplate:null}, // Moet alleen nog ff formatten naar dag / maand / jaar
        {name: 'Kwaliteit', prop: 'quality', cellTemplate:null},
        {name: 'details', prop: 'button', cellTemplate:null}
    ];


    constructor(apiSample: ApiSampleService, apiLocation: ApiLocationService, route: ActivatedRoute) {
        this.apiLocation = apiLocation;
        this.apiSample = apiSample;
        this.route = route;
    }

    ngOnInit() {
        this.getCurrentLocation();
    }

    ngAfterViewInit() {
        this.sampleColumns[2].cellTemplate = this.sampleDetailsTemplate;
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
}
