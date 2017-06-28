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
import {SimpleWEWValue, WEWFactor, WEWFactorClass} from '../../wew/wew.model';
import {ApiWewService} from '../../wew/api.wew.service';
import {MarkerLocation} from "../../locations/markerLocation.model";

type FactorClassCalculation = {
    factorClass: WEWFactorClass,
    sampleValue: number,
};

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
    @ViewChild('locationsButtonTemplateAll') locationsButtonTemplateAll;
    public wewConfig: WewChartConfig;
    public locations = [];
    public locationColumns = [
        {name: 'Mp', prop: 'code', cellTemplate: null},
        {name: 'Naam', prop: 'description', cellTemplate: null},
        {name: 'Monsters', prop: 'button', cellTemplate: null}
    ];
    public samples = [];
    public sampleColumns = [
        {name: 'Datum genomen', prop: 'date', cellTemplate: null},
        {name: 'Kwaliteit', prop: 'quality', cellTemplate:null},
        {name: 'Details', prop: 'button', cellTemplate: null}
    ];
    public comparedSampleColumns = [
        {name: 'Staaf nummer', prop: 'id'},
        {name: 'Datum genomen', prop: 'date'},
        {name: 'Locatie', prop: 'locationName'}
    ];
    public comparedSampleRows = [];
    public showLocationTable = true;
    public showSampleTable = false;
    public showGraph = false;
    public selectedLocation = {};
    public samplesToCompare = [];
    private factors: WEWFactor[];
    public wewConfigs: WewChartConfig[];
    private wewChartInstance;
    public entityCalc = [];
    private factorClassIdMap: Map<number/*factor class id*/, WEWFactorClass>;
    private calcMap: Map<WEWFactorClass, SimpleWEWValue>;

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
        this.sampleColumns[2].cellTemplate = this.samplesButtonTemplate;
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
        this.samples.forEach((sample) => {
            if (sample.id == id) {
                var index = this.samples.indexOf(sample, 0);
                this.samples.splice(index, 1);
            }
        })
    }

    private getAllLocations() {
        this.apiLocation.getAllLocations()
            .subscribe(locations => {
                this.locations = locations;
            }, error => console.log(error));
    }

    private getLocationById(id: number) {
        this.apiLocation.getById(id)
            .subscribe(location => {
                this.selectedLocation = location;
            }, error => console.log(error));
    }

    private getSampleById(id: number) {
        this.apiSample.getSample(id)
            .subscribe(sample => {
                var name = this.selectedLocation['description'];
                this.samplesToCompare.push({
                    sample: sample,
                    locationName: name
                });
                console.log(this.samplesToCompare)
                this.addToChart();
            }, error => console.log(error));
    }

    private getSamplesByLocationId(id: number) {
        this.apiSample.getByLocationId(id)
            .subscribe(samples => {
                this.samples = samples;
            }, error => console.log(error));
    }

    public setShowLocationTable() {
        this.showSampleTable = false;
        this.showLocationTable = true;
        this.selectedLocation = {};
    }

    private loadFactors() {
        this.apiWew.getFactors()
            .subscribe(factors => {
                this.factors = factors;
            }, error => console.log(error));
    }

    public addToChart() {
        this.comparedSampleRows.splice(0);
        const palette = new MaterialPalette().shift();
        const chartEntities = [];
        var entityCounter = 1;

        this.samplesToCompare.forEach((item) => {
            console.log(item)
            const name = item.sample.date.toLocaleString('nl-NL', {
                day: 'numeric',
                month: 'short',
                year: 'numeric'
            });
            chartEntities.push(this.chartEntityManager
                .createFromSample(item.sample, entityCounter.toString(), palette.clone()));
            this.comparedSampleRows.push({
                id: entityCounter,
                date: name,
                locationName: item.locationName
            })
            entityCounter++;
        });

        this.wewConfigs = this.factors.map(factor => {
            const config: WewChartConfig = {
                entities: chartEntities,
                factors: [factor],
                xAxis: 'entity',
                width: (chartEntities.length + 1) * 100,
                height: 350,
            };
            return config;
        });
        this.showGraph = true;
        if (this.wewChartInstance) {
            this.wewChartInstance.reload(this.wewConfigs);
        }
    }

    public onWewChartInit(wewChartInstance) {
        if (!wewChartInstance)
            this.wewChartInstance = wewChartInstance;
    }

    public compareCurrentLocation() {
        this.samples.forEach((item) => {
            this.samplesToCompare.push({sample: item, locationName: this.selectedLocation['description']});
        });
        this.samples.splice(0);
        this.addToChart();
    }

    public clearGraph() {
        this.samplesToCompare.splice(0);
        this.wewConfigs.splice(0);
        this.comparedSampleRows.splice(0)
        this.getSamplesByLocationId(this.selectedLocation['id']);
        this.showGraph = false;
    }

    public resetLocation() {
        if (this.samplesToCompare)
            this.samplesToCompare.splice(0);
        if (this.wewConfigs)
            this.wewConfigs.splice(0);
        if (this.comparedSampleRows)
            this.comparedSampleRows.splice(0)
        this.getSamplesByLocationId(this.selectedLocation['id']);
        this.showGraph = false;
    }
}
