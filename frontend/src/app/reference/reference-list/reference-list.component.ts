import {Component,OnInit} from '@angular/core';
import {Router} from '@angular/router';

import {Reference} from '../reference.model';
import {Watertype} from '../../watertype/watertype.model';
import {ApiReferenceService} from '../api.reference.service';
import {ApiWatertypeService} from '../../watertype/api.watertype.service';

import 'rxjs/add/operator/toPromise';

type ReferenceListItem = {watertype:Watertype,reference?:Reference};

@Component({
	selector:'app-reference-list',
	providers:[ApiReferenceService,ApiWatertypeService],
	templateUrl:'./reference-list.component.html',
	styleUrls:['./reference-list.component.css']
})
export class ReferenceListComponent implements OnInit{
	private listItems:ReferenceListItem[];
	
	constructor(
		private referenceApi:ApiReferenceService,
		private watertypeApi:ApiWatertypeService,
		private router:Router
	){
		let wtPr:Promise<Watertype[]> = watertypeApi.getAll().toPromise();
		let refPr:Promise<Reference[]> = referenceApi.getAll().toPromise();
		
		Promise.all([wtPr,refPr]).then(([watertypes,references]) => this.makeList(watertypes,references));
	}
	
	ngOnInit(){}
	
	private makeList(watertypes:Watertype[],references:Reference[]){
		this.listItems = [];
		let watertypeListItemMap:Map<number/*watertype id*/,ReferenceListItem> = new Map();
		
		//Add item to the list for each watertype
		watertypes.forEach(watertype => {
			let listItem = {watertype:watertype};
			this.listItems.push(listItem);
			watertypeListItemMap.set(watertype.id,listItem);
		});
		
		//Add references to list items
		references.forEach(reference => {
			let listItem = watertypeListItemMap.get(reference.watertypeId);
			if(listItem){
				listItem.reference = reference;
			}
		});
	}
	
	public delete(item:ReferenceListItem):void{
		let sure = confirm('Weet u zeker dat u de referentie van '+item.watertype.code+' - '+item.watertype.name+' wil verwijderen?')
		if(!sure)
			return;
		
		this.referenceApi.delete(item.reference.id).subscribe(success => {
			if(success)
				item.reference = null;
		});
	}
	
	public edit(item:ReferenceListItem):void{
		this.router.navigate(['/reference/edit/',item.reference.id]);
	}
	
	public create(item:ReferenceListItem):void{
		let reference = new Reference();
		reference.watertypeId = item.watertype.id;
		this.referenceApi.save(reference).subscribe(ref => {
			item.reference = ref;
			this.edit(item);
		});
	}
}
