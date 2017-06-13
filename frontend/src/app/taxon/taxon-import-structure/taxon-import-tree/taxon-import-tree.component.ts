import {Component,OnInit,Input} from '@angular/core';
import {Taxonx} from '../taxon-import-structure.component';


@Component({
	selector:'app-taxon-import-tree',
	templateUrl:'./taxon-import-tree.component.html',
	styleUrls:['./taxon-import-tree.component.css']
})
export class TaxonImportTreeComponent implements OnInit {
	@Input() taxon:Taxonx;
	@Input() depth:number;
	constructor(){}
	ngOnInit(){}
	
	toggleExpand(){this.taxon.expanded = !this.taxon.expanded;}
}
