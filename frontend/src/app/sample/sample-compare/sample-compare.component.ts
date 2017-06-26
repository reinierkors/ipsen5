import {AfterViewInit, Component, OnInit, ViewChild} from '@angular/core';
import {ApiSampleService} from '../api.sample.service';
import {ActivatedRoute} from '@angular/router';
import {ApiLocationService} from '../../locations/api.location.service';
import {WewChartConfig} from '../../wew/wew-bar-chart/wew-bar-chart.component';
import {MaterialPalette} from '../../services/palette';
import {
    ChartEntity,
    ChartEntityManager
} from '../../wew/wew-bar-chart/chart-entity.model';
import {WEWFactor} from '../../wew/wew.model';
import {ApiWewService} from '../../wew/api.wew.service';

@Component({
    providers: [ApiSampleService, ApiLocationService, ChartEntityManager, ApiWewService],
    selector: 'app-sample-compare',
    templateUrl: './sample-compare.component.html',
    styleUrls: ['./sample-compare.component.css']
})
export class SampleCompareComponent implements OnInit, AfterViewInit {
    @ViewChild('locationsButtonTemplate') locationsButtonTemplate;
    @ViewChild('samplesButtonTemplate') samplesButtonTemplate;
    @ViewChild('sampleDateTemplate') sampleDateTemplate;
    public wewConfig: WewChartConfig;
    public locations = [];
    public locationColumns = [
        {name: 'Mp', prop: 'code', cellTemplate: null},
        {name: 'Naam', prop: 'description', cellTemplate: null},
        {name: 'details', prop: 'button', cellTemplate: null}
    ];
    public samples = [];
    public sampleColumns = [
        {name: 'Datum genomen', prop: 'date', cellTemplate: null},
        {name: 'details', prop: 'button', cellTemplate: null}
    ];
    public showLocationTable = true;
    public showSampleTable = false;
    public selectedLocation = {};
    public samplesToCompare = [];
    private factors: WEWFactor[];
    public wewConfigs: WewChartConfig[];
    private wewChartInstance;

    constructor(private apiSample: ApiSampleService, private apiLocation: ApiLocationService,
                private route: ActivatedRoute, private chartEntityManager: ChartEntityManager,
                private apiWew: ApiWewService) {
    }

    ngOnInit() {
        this.getAllLocations();
        this.loadFactors();
    }

    ngAfterViewInit() {
        this.locationColumns[2].cellTemplate = this.locationsButtonTemplate;
        this.sampleColumns[0].cellTemplate = this.sampleDateTemplate;
        this.sampleColumns[1].cellTemplate = this.samplesButtonTemplate;
    }

    public onSelect(id) {
        if (this.showLocationTable) {
            this.getLocationById(id);
            this.getSamplesByLocationId(id);
            this.showLocationTable = false;
            this.showSampleTable = true;
            return;
        }
        this.getSampleById(id);
    }

    private getAllLocations() {
        this.route.params
            .switchMap(params => this.apiLocation.getAllLocations())
            .subscribe(locations => {
                this.locations = locations;
            }, error => console.log(error));
    }

    private getLocationById(id: number) {
        this.route.params
            .switchMap(params => this.apiLocation.getById(id))
            .subscribe(location => {
                this.selectedLocation = location;
            }, error => console.log(error));
    }

    private getSampleById(id: number) {
        this.route.params
            .switchMap(params => this.apiSample.getSample(id))
            .subscribe(sample => {
                this.samplesToCompare.push(sample);
                this.addToChart();
            }, error => console.log(error));
    }

    private getSamplesByLocationId(id: number) {
        this.route.params
            .switchMap(params => this.apiSample.getByLocationId(id))
            .subscribe(samples => {
                this.samples = samples;
            }, error => console.log(error));
    }

    public setShowLocationTable() {
        this.showSampleTable = false;
        this.showLocationTable = true;
    }

    private loadFactors() {
        this.route.params
            .switchMap(params => this.apiWew.getFactors())
            .subscribe(factors => {
                this.factors = factors;
            }, error => console.log(error));
    }

    public addToChart() {
        const palette = new MaterialPalette().shift();
        const chartEntities = [];
        this.samplesToCompare.forEach((item) => {
            const name = item.date.toLocaleString('nl-NL', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            chartEntities.push(this.chartEntityManager.createFromSample(item, name, palette.clone()));
        });
        // this.wewConfig = {
        //     entities: chartEntities,
        // };

        this.wewConfigs = this.factors.map(factor => {
            const config: WewChartConfig = {
                entities: chartEntities,
                factors: [factor],
                xAxis: 'entity',
                width: (chartEntities.length + 1) * 90,
                height: 350,
            };
            return config;
        });
        setTimeout(() => this.reload());
    }

    public onWewChartInit(wewChartInstance) {
        if (!wewChartInstance)
            this.wewChartInstance = wewChartInstance;
    }

    public reload() {
        if (this.wewChartInstance)
            this.wewChartInstance.reload();
    }

    public compareCurrentLocation() {
        this.samplesToCompare = this.samples;
        this.addToChart();
    }
}
