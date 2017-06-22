import {Component, OnInit} from "@angular/core";
import {ActivatedRoute} from "@angular/router";
import {ApiSampleService} from "../api.sample.service";
import {Sample} from "../sample.model";
import {ApiTaxonService} from "../../taxon/api.taxon.service";
import {Taxon, TaxonGroup} from "../../taxon/taxon.model";
import {ApiLocationService} from "../../locations/api.location.service";
import {MarkerLocation} from "../../locations/markerLocation.model";

import 'rxjs/add/operator/toPromise';


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
    public groups: TaxonGroup[];
    public location: MarkerLocation;
    public showChart = false;
    public markerPos;
    public echart;
    public option;
    public option2;
    public firstGraphEnabled = 1;
    public secondGraphEnabled = 0;

    private groupsPr:Promise<TaxonGroup[]>;

    constructor(apiSample: ApiSampleService, apiTaxon: ApiTaxonService, apiLocation: ApiLocationService, route: ActivatedRoute) {
        this.apiSample = apiSample;
        this.apiTaxon = apiTaxon;
        this.apiLocation = apiLocation;
        this.route = route;

        this.option = this.defaultSettings();
        this.option2 = this.defaultSettings();

        this.groupsPr = this.apiTaxon.getGroups().toPromise().then(groups => this.groups = groups);
    }

    setActiveGraph(bool) {
        if (bool) {
            this.firstGraphEnabled = 0;
            this.secondGraphEnabled = 1;
        } else {
            this.firstGraphEnabled = 1;
            this.secondGraphEnabled = 0;
        }
    }

    defaultSettings() {
        return {
            title: {
                text: 'Aantal beestjes gevonden',
                subtext: 'per monster',
                x: 'center'
            },
            tooltip: {
                trigger: 'item',
                formatter: "{a} <br/>{b} : {c} ({d}%)",
            },
            legend: {
                orient: 'vertical',
                left: 'left',
                data: [/* Legenda data */]
            },
            series: [
                {
                    name: 'Gevonden',
                    type: 'pie',
                    radius: '55%',
                    center: ['50%', '60%'],
                    data: [/* data*/],
                    itemStyle: {
                        emphasis: {
                            shadowBlur: 10,
                            shadowOffsetX: 0,
                            shadowColor: 'rgba(0, 0, 0, 0.5)'
                        }
                    }
                }
            ]
        };
    }

    updateGraph(group:TaxonGroup, taxonValues:Map<Taxon,number>) {
        let names = Array.from(taxonValues.keys()).map(taxon => taxon.name);

        let output = [];
        taxonValues.forEach((value,taxon) => {
            output.push({name:taxon.name,value:value});
        })

        this.option2.legend.data = names;
        this.option2.series[0].data = output;
    }

    onChartInit(echart) {
        this.echart = echart;

        echart.on('click', params => {
            this.setActiveGraph(1);

            let group = params.data.data.group;
            let taxa = params.data.data.taxa;
            let taxonValues:Map<Taxon,number/*value*/> = new Map();
            taxa.forEach(taxon => taxonValues.set(taxon,this.sample.taxonValues.get(taxon.id)));

            this.updateGraph(group,taxonValues);
        });
    }

    ngOnInit() {
        this.route.params.map(params => parseInt(params.id)).subscribe(id => {
            let samplePr = this.apiSample.getSample(id).toPromise();
            Promise.all([samplePr,this.groupsPr]).then(([sample,groups]) => {
                this.sample = sample;
                this.retrieveTaxon();
                this.retrieveLocation();
            });
        });
    }

    private retrieveTaxon() {
        let groupMap: Map<number/*taxon group id*/, TaxonGroup> = new Map();
        this.groups.forEach(group => groupMap.set(group.id, group));

        let taxonIds = Array.from(this.sample.taxonValues.keys());
        this.apiTaxon.getByIds(taxonIds).subscribe(taxon => {
            let names = [];
            let output = [];
            this.taxon = taxon;

            let groupTaxaMap: Map<TaxonGroup, Taxon[]> = new Map();

            this.groups.forEach(group => {
                groupTaxaMap.set(group, taxon.filter(tax => tax.groupId == group.id));
            });

            groupTaxaMap.forEach((taxa: Taxon[], group: TaxonGroup) => {
                let totalValue = taxa.map(tax => this.sample.taxonValues.get(tax.id)).reduce((cur, total) => total + cur, 0);
                if (totalValue) {
                    let data = {group:group, taxa:taxa};
                    output.push({value: totalValue, name: group.description, data: data});
                }
            });

            this.option.legend.data = names;
            this.option.series[0].data = output;

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
            }, error => console.log(error));
    }

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
        mapTypeId: "satellite",
        center: {},
        zoom: 18,
        disableDefaultUI: false,
        clickableIcons: true,
    };
}
