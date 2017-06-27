import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {DatatableComponent} from "@swimlane/ngx-datatable";

import {MarkerLocation} from '../../locations/markerLocation.model';
import {ApiLocationService} from '../../locations/api.location.service';
import {Sample} from '../../sample/sample.model';
import {ApiSampleService} from '../../sample/api.sample.service';
import {Reference} from '../../reference/reference.model';
import {ApiReferenceService} from '../../reference/api.reference.service';
import {WEWFactor} from '../../wew/wew.model';
import {ApiWewService} from '../../wew/api.wew.service';
import {WewChartConfig} from '../../wew/wew-bar-chart/wew-bar-chart.component';
import {MaterialPalette} from '../../services/palette';
import {ChartEntityManager} from '../../wew/wew-bar-chart/chart-entity.model';

import 'rxjs/add/operator/toPromise';

@Component({
	selector:'app-water',
	providers:[ApiSampleService,ApiLocationService,ApiWewService,ApiReferenceService,ChartEntityManager],
	templateUrl:'./water.component.html',
	styleUrls:['./water.component.css']
})
export class WaterComponent implements OnInit{
	public currentLocation:MarkerLocation;
	private samples:Sample[];
	private factors:WEWFactor[];
	private reference:Reference;

	@ViewChild(DatatableComponent) table: DatatableComponent;
	@ViewChild('sampleDateTemplate') sampleDateTemplate;
	@ViewChild('sampleDetailsTemplate') sampleDetailsTemplate;
	@ViewChild('sampleQualityTemplate') sampleQualityTemplate;
	
    sampleRows = [];
    sampleColumns = [
        {name: 'Datum', prop: 'date', cellTemplate:null}, // Moet alleen nog ff formatten naar dag / maand / jaar
        {name: 'Kwaliteit', prop: 'quality', cellTemplate:null},
        {name: 'details', prop: 'button', cellTemplate:null}
    ];
	public markerPos;
	
	public wewConfigs:WewChartConfig[];
	
	private qualityEchart;
	public qualityChartOptions = {
		title:{text:'Verschil tussen monsters en referentie',subtext:'Lager is beter'},
		tooltip:{
			trigger:'axis',
			axisPointer:{type:'shadow'},
			backgroundColor:'rgba(0,0,0,0.9)',
			formatter:params=>params[0].data[0].toLocaleString('nl-NL',{day:'numeric',month:'short',year:'numeric'})+': '+params[0].data[1].toFixed(2)
		},
		grid:{left:'3%',right:'4%',bottom:'4%',containLabel:true},
		xAxis:{type:'time',data:[],axisLabel:{formatter:val=>new Date(val).toLocaleString('nl-NL',{day:'numeric',month:'short',year:'numeric'})}},
		yAxis:{type:'value',boundaryGap:[0, 0.01],min:0},
		series:{},
		toolbox:{right:50,feature:{saveAsImage:{title:'Download grafiek'}}}
	};
	
	constructor(
		private apiSample:ApiSampleService,
		private apiLocation:ApiLocationService,
		private apiWew:ApiWewService,
		private apiReference:ApiReferenceService,
		private chartEntityManager:ChartEntityManager,
		private route:ActivatedRoute
	){}
	
	ngOnInit(){
		this.loadResources();
	}
	
	ngAfterViewInit(){
		this.sampleColumns[0].cellTemplate = this.sampleDateTemplate;
		this.sampleColumns[1].cellTemplate = this.sampleQualityTemplate;
		this.sampleColumns[2].cellTemplate = this.sampleDetailsTemplate;
	}
	
	onQualityChartInit(echart){
		this.qualityEchart = echart;
	}
	
	private async loadResources(){
		let locationId = await this.getLocationId();
		
		let locationPr = this.loadLocation(locationId);
		let samplesPr = this.loadSamples(locationId);
		let factorsPr = this.loadFactors();
		
		let referencePr = locationPr.then(() => this.loadReference());
		
		Promise.all([samplesPr,factorsPr,referencePr]).then(() => {
			this.loadMap();
			this.loadQualityChart();
			this.loadWewCharts();
		});
	}
	
	private async getLocationId():Promise<number>{
		let params = this.route.snapshot.paramMap;
		let id = parseInt(params.get('id'));
		return id;
	}
	
	private async loadLocation(id:number){
		this.currentLocation = await this.apiLocation.getById(id).toPromise();;
	}
	
	private async loadSamples(locationId:number){
		this.samples = await this.apiSample.getByLocationId(locationId).toPromise();
		this.samples.sort((a,b) => a.date.valueOf()-b.date.valueOf());
		this.sampleRows = this.samples;
	}
	
	private async loadFactors(){
		this.factors =  await this.apiWew.getFactors().toPromise();
	}
	
	private async loadReference(){
		let watertype = this.currentLocation.watertypeKrwId;
		this.reference = await this.apiReference.getByWatertype(watertype).toPromise();
	}
	
	private loadQualityChart(){
		this.qualityChartOptions.series = {
			type:'line',
			data:this.samples.map((sample,index) => [sample.date,sample.quality])
		};
		this.qualityChartOptions.xAxis.data = this.samples.map(sample => sample.date);
		this.qualityEchart.setOption(this.qualityChartOptions,true);
	}
	
	private loadWewCharts(){
		let chartReference = this.chartEntityManager.createFromReference(this.reference,'Referentie',new MaterialPalette().shift().transform(-.03,-.1,-.26));
		let chartSamples = this.samples.map(sample => {
			let name = sample.date.toLocaleString('nl-NL',{month:'short',year:'numeric'});
			return this.chartEntityManager.createFromSample(sample,name,new MaterialPalette().shift());
		});
		
		this.wewConfigs = this.factors.map(factor => {
			let config:WewChartConfig = {
				entities:[chartReference,...chartSamples],
				factors:[factor],
				xAxis:'entity',
				width:(chartSamples.length+1)*90,
				height:350,
			};
			return config;
		});
	}
	
	private loadMap(){
		this.mapConfig.center = {
			lat: this.currentLocation.latitude,
			lng: this.currentLocation.longitude
		};
		this.markerPos = {
			lat: this.currentLocation.latitude,
			lng: this.currentLocation.longitude
		}
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
