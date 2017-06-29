import {Component,OnInit,Input} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Sample} from "../sample.model";
import {ApiSampleService} from '../api.sample.service';
import {Reference} from '../../reference/reference.model';
import {ApiReferenceService} from '../../reference/api.reference.service';
import {WEWFactor,WEWFactorClass,SimpleWEWValue} from '../../wew/wew.model';
import {ApiWewService} from '../../wew/api.wew.service';
import {MarkerLocation} from '../../locations/markerLocation.model';
import {ApiLocationService} from '../../locations/api.location.service';

type FactorClassCalculation = {
	factorClass:WEWFactorClass,
	sampleValue:number,
	referenceValue:number,
	difference:number
};

type FactorCalculation = {
	factor:WEWFactor,
	total:number,
	calculations:FactorClassCalculation[]
};

@Component({
	selector:'app-sample-quality-sheet',
	providers:[ApiSampleService,ApiReferenceService,ApiWewService,ApiLocationService],
	templateUrl:'./sample-quality-sheet.component.html',
	styleUrls:['./sample-quality-sheet.component.css']
})
export class SampleQualitySheetComponent implements OnInit{
	public factorCalcs:FactorCalculation[];
	public sample:Sample;
	public location:MarkerLocation;
	public totalDiff:number;
	
	private factors:WEWFactor[];
	private factorClassIdMap:Map<number/*factor class id*/,WEWFactorClass>;
	private sampleCalcMap:Map<WEWFactorClass,SimpleWEWValue>;
	private referenceCalcMap:Map<WEWFactorClass,SimpleWEWValue>;
	
	constructor(
		private sampleApi:ApiSampleService,
		private referenceApi:ApiReferenceService,
		private wewApi:ApiWewService,
		private locationApi:ApiLocationService,
		private route:ActivatedRoute
	){}
	
	async ngOnInit(){
		let id = await this.getSampleId();
		
		//Load factors
		let factorsPr = this.wewApi.getFactors().toPromise();
		
		//Load sample and its calculations
		this.sample = await this.sampleApi.getSample(id).toPromise();
		let sampleCalcPr = this.sampleApi.getCalculationsBySample(this.sample.id).toPromise();
		
		//Load reference and is calculations
		this.location = await this.locationApi.getById(this.sample.locationId).toPromise();
		let reference = await this.referenceApi.getByWatertype(this.location.watertypeKrwId).toPromise();
		let refCalcPr = this.referenceApi.getCalculationsByReference(reference.id).toPromise();
		
		//Wait for factors to be loaded
		this.factors = await factorsPr;
		this.factorClassIdMap = new Map();
		this.factors.forEach(factor => factor.classes.forEach(fc => this.factorClassIdMap.set(fc.id,fc)));
		
		//Make easy lookup maps Map<WEWFactorClass,SimpleWEWValue>
		this.sampleCalcMap = await this.makeFactorClassCalcMap(sampleCalcPr);
		this.referenceCalcMap = await this.makeFactorClassCalcMap(refCalcPr);
		
		//Make objects to show on the page
		this.doCalculations();
	}
	
	private async getSampleId():Promise<number>{
		let idPr:Promise<string> = new Promise((resolve,reject) => {
			this.route.paramMap.subscribe(paramMap => resolve(paramMap.get('id')),reject);
		});
		let id:number = Number.parseInt(await idPr);
		return id;
	}
	
	private async makeFactorClassCalcMap(calcsPr:Promise<SimpleWEWValue[]>):Promise<Map<WEWFactorClass,SimpleWEWValue>>{
		let calcs = await calcsPr;
		let map:Map<WEWFactorClass,SimpleWEWValue> = new Map();
		calcs.forEach(calc => map.set(this.factorClassIdMap.get(calc.factorClassId),calc));
		return map;
	}
	
	private doCalculations(){
		this.factorCalcs = this.factors.map(factor => {
			let calculations = factor.classes.map(factorClass => {
				let referenceValue = this.referenceCalcMap.get(factorClass).value;
				let sampleValue = this.sampleCalcMap.get(factorClass).value;
				return {
					factorClass,
					referenceValue,
					sampleValue,
					difference:Math.abs(referenceValue-sampleValue)
				};
			});
			return {
				factor,
				calculations,
				total:calculations.reduce((total,next) => total+next.difference,0)
			};
		});
		
		this.totalDiff = this.factorCalcs.reduce((result,{total}) => result+total,0);
	}
}
