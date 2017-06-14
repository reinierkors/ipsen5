import {Component,OnInit} from '@angular/core';
import {trigger,style,transition,animate,group,state} from '@angular/animations';

import {Taxon,TaxonGroup,TaxonLevel} from '../taxon.model';
import {ApiTaxonService} from '../api.taxon.service';

import 'rxjs/add/operator/toPromise';

type State = 'anim'|'error'|'loading'|'ready';
type TreeRow = {taxon:Taxon,depth:number,isRefer:boolean,depthLines:string,postfix:string};


@Component({
	selector:'app-taxon-view',
	providers:[ApiTaxonService],
	templateUrl:'./taxon-view.component.html',
	styleUrls:['./taxon-view.component.css'],
	animations:[
		trigger('mainCardAnim',[
			state('void',style({opacity:0})),
			transition(':enter',[animate('300ms 150ms',style({opacity:1}))]),
			transition(':leave',[animate('150ms', style({opacity:0}))])
		])
	]
})
export class TaxonViewComponent implements OnInit{
	//The state of the import process
	state:State = 'loading';
	//NextState is used to go to the correct state after an animated transition
	private nextState:State;
	//Any errors that happen during the process
	errors:any[] = [];
	
	animalia:TreeRow[];
	otherTaxa:TreeRow[];
	
	constructor(
		private taxonApi:ApiTaxonService
	){
		let groupPr = taxonApi.getGroups().toPromise();
		let levelPr = taxonApi.getLevels().toPromise();
		let taxonPr = taxonApi.getAll().toPromise();
		
		Promise.all([groupPr,levelPr,taxonPr]).then(([groups,levels,taxa]) => this.createTree(groups,levels,taxa));
	}
	
	ngOnInit(){}
	
	//Set the state of the importing process
	private setState(state:State){
		this.state = 'anim';
		this.nextState = state;
	}
	
	//Go to the next state when the :leave animation finishes
	public mainCardAnimDone($event){
		if($event.toState==='void'){
			this.state = this.nextState;
		}
	}
	
	//ToDo: improve error handling
	//Right now we just print the array as json on the page
	private handleError(...error){
		this.setState('error');
		this.errors.push(error);
	}
	
	private createTree(groups:TaxonGroup[],levels:TaxonLevel[],taxa:Taxon[]){
		//Create easy lookup maps
		let groupIdMap:Map<number/*group id*/,TaxonGroup> = new Map();
		let levelIdMap:Map<number/*level id*/,TaxonLevel> = new Map();
		let taxonIdMap:Map<number/*taxon id*/,Taxon> = new Map();
		
		groups.forEach(group => groupIdMap.set(group.id,group));
		levels.forEach(level => levelIdMap.set(level.id,level));
		taxa.forEach(taxon => taxonIdMap.set(taxon.id,taxon));
		
		//Create a hierarchy
		let taxonParentMap:Map<Taxon/*parent*/,Taxon[]/*children*/> = new Map();
		let taxonReferMap:Map<Taxon/*being referred to*/,Taxon[]/*referring to*/> = new Map();
		
		//Make empty arrays
		taxa.forEach(taxon => {
			taxonParentMap.set(taxon,[]);
			taxonReferMap.set(taxon,[]);
		});
		
		//Fill arrays
		taxa.filter(taxon => taxon.parentId).forEach(taxon => taxonParentMap.get(taxonIdMap.get(taxon.parentId)).push(taxon));
		taxa.filter(taxon => taxon.referId).forEach(taxon => taxonReferMap.get(taxonIdMap.get(taxon.referId)).push(taxon));
		
		//Turn hierarchy into list
		let animalia:TreeRow[] = [];
		let otherTaxa:TreeRow[] = [];
		let addRecursive = (list:TreeRow[],taxon:Taxon,depth:number,depthLines:string,lastChildOfParent:boolean) => {
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
		
		//Find the animalia first
		taxa.filter(taxon => taxon.name==='animalia').forEach(taxon => addRecursive(animalia,taxon,0,'',false));
		
		//Then do anything that's not under it
		taxa.filter(taxon => taxon.name!=='animalia'&&!taxon.parentId&&!taxon.referId).forEach(taxon => addRecursive(otherTaxa,taxon,0,'',false));
		
		//Show that stuff
		this.animalia = animalia;
		this.otherTaxa = otherTaxa;
		
		this.setState('ready');
	}
}
