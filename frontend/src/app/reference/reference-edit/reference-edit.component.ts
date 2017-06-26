import {Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';

import {Reference} from '../reference.model';
import {Watertype} from '../../watertype/watertype.model';
import {Taxon} from '../../taxon/taxon.model';
import {ApiReferenceService} from '../api.reference.service';
import {ApiWatertypeService} from '../../watertype/api.watertype.service';
import {ApiTaxonService} from '../../taxon/api.taxon.service';

import {uniqueFilter} from '../../services/arrayUtils';

@Component({
	selector:'app-reference-edit',
	providers:[ApiReferenceService,ApiWatertypeService,ApiTaxonService],
	templateUrl:'./reference-edit.component.html',
	styleUrls:['./reference-edit.component.css']
})
export class ReferenceEditComponent implements OnInit{
	public reference:Reference;
	public watertype:Watertype;
	public taxaList:String = null;
	public saving:boolean = false;
	
	constructor(
		private referenceApi:ApiReferenceService,
		private watertypeApi:ApiWatertypeService,
		private taxonApi:ApiTaxonService,
		private route:ActivatedRoute
	){}
	
	ngOnInit(){
		this.route.params.map(params => parseInt(params.id)).subscribe(id => {
			this.referenceApi.getReference(id).subscribe(reference => {
				this.watertypeApi.getWatertype(reference.watertypeId).subscribe(watertype => {
					this.reference = reference;
					this.watertype = watertype;
					this.showTaxa();
				});
			});
		});
	}
	
	private showTaxa(){
		if(this.reference.taxonIds.length){
			this.taxonApi.getByIds(this.reference.taxonIds).subscribe(taxa => this.taxaList = taxa.map(taxon => taxon.name).join("\n"));
		}
		else{
			this.taxaList = '';
		}
	}
	
	getTaxaRows():number{
		return this.taxaList.split("\n").length;
	}
	
	save(){
		this.saving = true;
		let taxaNames = this.taxaList.split("\n");
		taxaNames = taxaNames.map(name => name.trim().toLowerCase()).filter(name => name).filter(uniqueFilter);
		this.taxonApi.findOrCreate(taxaNames).subscribe(taxa => {
			this.reference.taxonIds = taxa.map(taxon => taxon.id);
			this.referenceApi.save(this.reference).subscribe(ref => {
				this.reference = ref;
				this.showTaxa();
				this.saving = false;
			});
		});
	}
}
