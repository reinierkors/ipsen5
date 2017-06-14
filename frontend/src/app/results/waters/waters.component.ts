import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {ApiSampleService} from "../../sample/api.sample.service";
import {ApiLocationService} from "../../locations/api.location.service";
import {Sample} from "../../sample/sample.model";

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
    public location: Location;
    public sample: Sample;
    public samples: Sample[];

    sampleRows = [];
    sampleColums = [
        {name: 'Datum', prop: 'date'},
        {name: 'Eigennaar', prop:'owner_id'},
        {name: 'Kwaliteit', prop: 'quality'},
        {name: 'X_coor', prop:'x_coor'},
        {name: 'Y_coor', prop:'y_coor'}
    ];

    constructor(apiSample: ApiSampleService, apiLocation: ApiLocationService, route: ActivatedRoute) {
        this.apiLocation = apiLocation;
        this.apiSample = apiSample;
        this.route = route;
    }

    ngOnInit() {
        //TODO: Make an api call to ApiLocation to get the relevant information about the location

        //TODO: Make an api call with the loction_id to the sampleAPI to get all relevant samples
        this.route.params
            .switchMap(params => this.apiSample.getSample(params["id"]))
            .subscribe(samples => {
                this.sample = samples
                console.log(samples)
            }, error => console.log(error));
    }

}
