import {Component,OnInit,Input} from '@angular/core';

import {Taxon} from '../taxon.model';

type TreeItem = {taxon:Taxon,depth:number,children:TreeItem[]};

@Component({
	selector:'app-taxon-tree',
	templateUrl:'./taxon-tree.component.html',
	styleUrls:['./taxon-tree.component.css']
})
export class TaxonTreeComponent implements OnInit {
	@Input() taxon:Taxon[];
	
	constructor(){}
	
	ngOnInit(){
		//Easy lookup
		let taxonNameMap:Map<string/*taxonname*/,Taxon> = new Map();
		let taxonIdMap:Map<number/*taxon id*/,Taxon> = new Map();
		
		this.taxon.forEach(taxon => {
			taxonNameMap.set(taxon.name,taxon);
			if(taxon.id)
				taxonIdMap.set(taxon.id,taxon);
		});
		
		//Tree item for each taxon
		let taxonTreeMap:Map<Taxon,TreeItem> = new Map();
		this.taxon.forEach(taxon => taxonTreeMap.set(taxon,{taxon:taxon,depth:0,children:[]}));
		
		//Tree hierarchy
		this.taxon.forEach(taxon => {
			let parent = taxonIdMap.get(taxon.parentId);
			
		});
		
		
	}
	
	
}
