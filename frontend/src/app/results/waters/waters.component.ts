import {Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

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
	selector:'app-waters',
	providers:[ApiSampleService,ApiLocationService,ApiWewService,ApiReferenceService,ChartEntityManager],
	templateUrl:'./waters.component.html',
	styleUrls:['./waters.component.css']
})
export class WatersComponent implements OnInit{
	public currentLocation:MarkerLocation;
	private samples:Sample[];
	private factors:WEWFactor[];
	private reference:Reference;
	
	public selected:number;
	public sampleRows:Sample[];
	public sampleColums = [
		{name:'Datum', prop:'date'}, // Moet alleen nog ff formatten naar dag / maand / jaar
		{name:'Eigennaar', prop:'owner_id'}, // Niet nodig voor gebruiker
		{name:'Kwaliteit', prop:'quality'},
		{name:'X_coor', prop:'xCoor'}, // Niet nodig voor gebruiker
		{name:'Y_coor', prop:'yCoor'} // Niet nodig voor gebruiker
	];
	
	public wewConfigs:WewChartConfig[];
	
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
	
	private async loadResources(){
		let locationId = await this.getLocationId();
		
		let locationPr = this.loadLocation(locationId);
		let samplesPr = this.loadSamples(locationId);
		let factorsPr = this.loadFactors();
		
		let referencePr = locationPr.then(() => this.loadReference());
		
		Promise.all([samplesPr,factorsPr,referencePr]).then(() => this.loadCharts());
	}
	
	private async getLocationId():Promise<number>{
		let params = this.route.snapshot.paramMap;
		let id = parseInt(params.get('id'));
		return id;
	}
	
	private async loadLocation(id:number){
		this.currentLocation = await this.apiLocation.getById(id).toPromise();
	}
	
	private async loadSamples(locationId:number){
		this.samples = await this.apiSample.getByLocationId(locationId).toPromise();
		this.sampleRows = this.samples;
	}
	
	private async loadFactors(){
		this.factors =  await this.apiWew.getFactors().toPromise();
	}
	
	private async loadReference(){
		let watertype = this.currentLocation.watertypeKrwId;
		this.reference = await this.apiReference.getByWatertype(watertype).toPromise();
	}
	
	private async loadCharts(){
		let chartReference = this.chartEntityManager.createFromReference(this.reference,'Referentie',new MaterialPalette().shift().transform(-.03,-.1,-.26));
		let chartSamples = this.samples.map(sample => {
			let name = sample.date.toLocaleString('nl-NL',{month:'short',year:'numeric'});
			return this.chartEntityManager.createFromSample(sample,name,new MaterialPalette().shift());
		});
		
		this.wewConfigs = this.factors.map(factor => {
			let config:WewChartConfig = {
				entities:[chartReference,...chartSamples],
				factors:[factor],
				xAxis:'entity'
			};
			return config;
		});
	}
	
	onSelect(selected) {
		this.selected = selected.row.id;
	}
}
