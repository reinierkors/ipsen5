import {Injectable} from '@angular/core';
import {Http} from '@angular/http';

import {Reference} from '../../reference/reference.model';
import {Sample} from '../../sample/sample.model';
import {Taxon} from '../../taxon/taxon.model';
import {Palette} from '../../services/palette';
import {SimpleWEWValue} from '../wew.model';
import {ApiReferenceService} from '../../reference/api.reference.service';
import {ApiSampleService} from '../../sample/api.sample.service';
import {ApiWewService} from '../api.wew.service';

@Injectable()
export class ChartEntityManager{
	private referenceApi:ApiReferenceService;
	private sampleApi:ApiSampleService;
	private wewApi:ApiWewService;
	
	constructor(http:Http){
		this.referenceApi = new ApiReferenceService(http);
		this.sampleApi = new ApiSampleService(http);
		this.wewApi = new ApiWewService(http);
	}
	
	public createFromReference(reference:Reference,name:string,palette:Palette):ReferenceChartEntity{
		if(reference==null)
			return null;
		return new ReferenceChartEntity(this.referenceApi,reference,name,palette);
	}
	
	public createFromSample(sample:Sample,name:string,palette:Palette):SampleChartEntity{
		if(sample==null)
			return null;
		return new SampleChartEntity(this.sampleApi,sample,name,palette);
	}
	
	public createFromTaxon(taxon:Taxon,palette:Palette):TaxonChartEntity{
		if(taxon==null)
			return null;
		return new TaxonChartEntity(this.wewApi,taxon,palette);
	}
}

export abstract class ChartEntity{
	constructor(
		public id:string,
		public name:string,
		public palette:Palette
	){};
	
	public abstract getCalculations():Promise<SimpleWEWValue[]>;
}

class ReferenceChartEntity extends ChartEntity{
	constructor(
		private referenceApi:ApiReferenceService,
		private reference:Reference,
		name:string,palette:Palette
	){
		super('ref'+reference.id,name,palette);
	}
	
	public getCalculations():Promise<SimpleWEWValue[]>{
		return this.referenceApi.getCalculationsByReference(this.reference.id).toPromise();
	}
}

class SampleChartEntity extends ChartEntity{
	constructor(
		private sampleApi:ApiSampleService,
		private sample:Sample,
		name:string,palette:Palette
	){
		super('sample'+sample.id,name,palette);
	}
	
	public getCalculations():Promise<SimpleWEWValue[]>{
		return this.sampleApi.getCalculationsBySample(this.sample.id).toPromise();
	}
}

class TaxonChartEntity extends ChartEntity{
	constructor(
		private wewApi:ApiWewService,
		private taxon:Taxon,
		palette:Palette
	){
		super('taxon'+taxon.id,taxon.name,palette);
	}
	
	public getCalculations():Promise<SimpleWEWValue[]>{
		return this.wewApi.getByTaxon([this.taxon.id])
			.map(wewValues => wewValues.map(wewValue => {
				let value = new SimpleWEWValue();
				value.factorClassId = wewValue.factorClassId;
				value.value = wewValue.value;
				return value;
			})).toPromise();
	}
}
