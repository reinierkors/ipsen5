import {Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {trigger,style,transition,animate,group,state} from '@angular/animations';

import {Taxon,TaxonGroup,TaxonLevel} from '../taxon.model';
import {ApiTaxonService} from '../api.taxon.service';
import {ApiWewService} from '../../wew/api.wew.service';
import {WEWValue,WEWFactor,WEWFactorClass} from '../../wew/wew.model';

import 'rxjs/add/operator/toPromise';

type State = 'anim'|'error'|'loading'|'ready';


@Component({
	selector:'app-taxon-view',
	providers:[ApiTaxonService,ApiWewService],
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
	
	root:Taxon;
	taxa:Taxon[];
	groups:TaxonGroup[];
	levels:TaxonLevel[];
	private wewFactorPr:Promise<WEWFactor[]>;
	wewFactors:WEWFactor[];
	wewValues:Map<WEWFactorClass,WEWValue> = new Map();
	
	constructor(
		private taxonApi:ApiTaxonService,
		private wewApi:ApiWewService,
		private route:ActivatedRoute
	){
		taxonApi.getGroups().subscribe(groups => this.groups = groups);
		taxonApi.getLevels().subscribe(levels => this.levels = levels);
		this.wewFactorPr = wewApi.getFactors().toPromise().then(factors => this.wewFactors = factors);
	}
	
	ngOnInit(){
		this.route.params.map(params => parseInt(params.id)).subscribe(id => {
			let familyPr:Promise<Taxon[]> = this.taxonApi.getFamily(id).toPromise();
			let wewPr:Promise<WEWValue[]> = this.wewApi.getByTaxon([id]).toPromise();
			
			familyPr.then(taxa => {
				this.taxa = taxa;
				this.root = taxa.filter(taxon => taxon.id==id)[0];
			});
			
			this.wewFactorPr.then(() => {
				wewPr.then(values => {
					let factorClassMap:Map<number/*factor class id*/,WEWFactorClass> = new Map();
					this.wewFactors.forEach(factor => factor.classes.forEach(fc => factorClassMap.set(fc.id,fc)));
					values.forEach(value => this.wewValues.set(factorClassMap.get(value.factorClassId),value));
				});
			});
			
			Promise.all([familyPr,this.wewFactorPr,wewPr]).then(() => this.setState('ready'));
		});
	}
	
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
}
