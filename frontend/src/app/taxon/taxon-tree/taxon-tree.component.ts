import {Component,OnInit,Input} from '@angular/core';

import {Taxon,TaxonGroup,TaxonLevel} from '../taxon.model';

type TreeRow = {taxon:Taxon,depth:number,isRefer:boolean,depthLines:string,postfix:string};

@Component({
	selector:'app-taxon-tree',
	templateUrl:'./taxon-tree.component.html',
	styleUrls:['./taxon-tree.component.css']
})
export class TaxonTreeComponent implements OnInit {
	@Input() root:Taxon;
	@Input() taxa:Taxon[];
	@Input() groups:TaxonGroup[];
	@Input() levels:TaxonLevel[];
	@Input() showAncestors:boolean;
	@Input() showDescendants:boolean;
	
	treeRows:TreeRow[];
	
	constructor(){}
	
	ngOnInit(){
		this.createTree();
	}
	
	private createTree(){
		//Create easy lookup maps
		let groupIdMap:Map<number/*group id*/,TaxonGroup> = new Map();
		let levelIdMap:Map<number/*level id*/,TaxonLevel> = new Map();
		let taxonIdMap:Map<number/*taxon id*/,Taxon> = new Map();
		
		this.groups.forEach(group => groupIdMap.set(group.id,group));
		this.levels.forEach(level => levelIdMap.set(level.id,level));
		this.taxa.forEach(taxon => taxonIdMap.set(taxon.id,taxon));
		
		//Create a hierarchy
		let taxonParentMap:Map<Taxon/*parent*/,Taxon[]/*children*/> = new Map();
		let taxonReferMap:Map<Taxon/*being referred to*/,Taxon[]/*referring to*/> = new Map();
		
		//Make empty arrays
		this.taxa.forEach(taxon => {
			taxonParentMap.set(taxon,[]);
			taxonReferMap.set(taxon,[]);
		});
		
		//Fill arrays
		this.taxa.filter(taxon => taxon.parentId).forEach(taxon => taxonParentMap.get(taxonIdMap.get(taxon.parentId)).push(taxon));
		this.taxa.filter(taxon => taxon.referId).forEach(taxon => taxonReferMap.get(taxonIdMap.get(taxon.referId)).push(taxon));
		
		
		//Only use the taxa we actually want to show
		let activeTaxa:Taxon[] = [this.root];
		let firstTaxon = this.root;
		
		//Ancestors
		if(this.showAncestors && this.root.parentId){
			let ancestor:Taxon = taxonIdMap.get(this.root.parentId);
			while(ancestor){
				activeTaxa.push(ancestor);
				ancestor = ancestor.parentId?taxonIdMap.get(ancestor.parentId):null;
			}
			//Store final ancestor to start the tree with
			firstTaxon = activeTaxa[activeTaxa.length-1];
		}
		
		//Descendants
		if(this.showDescendants){
			let lookingFor:Taxon[] = [this.root];
			while(lookingFor.length){
				let newLookingFor = [];
				lookingFor.forEach(taxon => {
					let children = taxonParentMap.get(taxon);
					if(children.length){
						newLookingFor.push(...children);
						activeTaxa.push(...children);
					}
				});
				lookingFor = newLookingFor;
			}
		}
		
		//Turn hierarchy into a list
		let treeRows:TreeRow[] = [];
		let addRecursive = (list:TreeRow[],taxon:Taxon,depth:number,depthLines:string,lastChildOfParent:boolean) => {
			if(!activeTaxa.includes(taxon))
				return;
			
			let postfix = [];
			if(taxon.groupId){
				let group = groupIdMap.get(taxon.groupId);
				postfix.push(group.description?group.description:group.code);
			}
			if(taxon.levelId)
				postfix.push(levelIdMap.get(taxon.levelId).name);
			
			list.push({
				taxon:taxon,
				depth:depth,
				isRefer:!!taxon.referId,
				postfix:postfix.length?'('+postfix.join(', ')+')':'',
				depthLines:depth?depthLines+(lastChildOfParent?' └─':' ├─'):''
			});
			if(depth)
				depthLines += lastChildOfParent?'   ':' │ ';
			taxonReferMap.get(taxon).forEach((taxon,index,array) => addRecursive(list,taxon,depth+1,depthLines,index===array.length-1));
			taxonParentMap.get(taxon).forEach((taxon,index,array) => addRecursive(list,taxon,depth+1,depthLines,index===array.length-1));
		};
		
		addRecursive(treeRows,firstTaxon,0,'',false);
		
		this.treeRows = treeRows;
	}

}
