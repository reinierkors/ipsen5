import {Component,OnInit,Input} from '@angular/core';

import {Taxon,TaxonGroup,TaxonLevel} from '../taxon.model';

type TreeItem = {taxon:Taxon,parent:TreeItem,depth:number,children:TreeItem[],referTo:TreeItem,referredToBy:TreeItem[]};

@Component({
	selector:'app-taxon-tree',
	templateUrl:'./taxon-tree.component.html',
	styleUrls:['./taxon-tree.component.css']
})
export class TaxonTreeComponent implements OnInit {
	@Input() taxa:Taxon[];
	
	treeItems:TreeItem[];
	
	constructor(){}
	
	ngOnInit(){
		//Easy lookup
		let taxonNameMap:Map<string/*taxonname*/,Taxon> = new Map();
		let taxonIdMap:Map<number/*taxon id*/,Taxon> = new Map();
		
		this.taxa.forEach(taxon => {
			taxonNameMap.set(taxon.name,taxon);
			if(taxon.id)
				taxonIdMap.set(taxon.id,taxon);
		});
		
		//Tree item for each taxon
		let taxonTreeMap:Map<Taxon,TreeItem> = new Map();
		this.taxa.forEach(taxon => taxonTreeMap.set(taxon,{
			taxon:taxon,
			parent:null,
			depth:null,
			children:[],
			referTo:null,
			referredToBy:[]
		}));
		this.treeItems = Array.from(taxonTreeMap.values());
		
		//Tree hierarchy
		this.treeItems.forEach(treeItem => {
			//Store parent/child relations
			if(treeItem.taxon.parentId){
				let parent:Taxon = taxonIdMap.get(treeItem.taxon.parentId);
				if(parent){
					let parentTI:TreeItem = taxonTreeMap.get(parent);
					treeItem.parent = parentTI;
					parentTI.children.push(treeItem);
				}
			}
			//Store refer relations
			if(treeItem.taxon.referId){
				let referTo:Taxon = taxonIdMap.get(treeItem.taxon.referId);
				if(referTo){
					let referToTI:TreeItem = taxonTreeMap.get(referTo);
					treeItem.referTo = referToTI;
					referToTI.referredToBy.push(treeItem);
				}
			}
		});
		
		//Set correct depths
		let recursiveDepth = (treeItem:TreeItem,depth:number) => {
			if(treeItem.depth!==null)
				return;
			treeItem.depth = depth;
			treeItem.children.forEach(ti => recursiveDepth(ti,depth+1));
			treeItem.referredToBy.forEach(ti => recursiveDepth(ti,depth+1));
		};
		this.treeItems.forEach(treeItem => recursiveDepth(treeItem,0));
	}
}
