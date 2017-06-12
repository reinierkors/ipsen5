import {Component,OnInit,Input} from '@angular/core';
import {Taxon} from '../species-import-structure.component';


@Component({
	selector:'app-species-import-tree',
	templateUrl:'./species-import-tree.component.html',
	styleUrls:['./species-import-tree.component.css']
})
export class SpeciesImportTreeComponent implements OnInit {
	@Input() taxon:Taxon;
	@Input() depth:number;
	constructor(){}
	ngOnInit(){}
}
