import {Component,OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {trigger,style,transition,animate,group,state} from '@angular/animations';

import {Taxon,TaxonGroup,TaxonLevel} from '../taxon.model';
import {ApiTaxonService} from '../api.taxon.service';
import {ApiWewService} from '../../wew/api.wew.service';
import {WewChartConfig} from '../../wew/wew-bar-chart/wew-bar-chart.component';
import {MaterialPalette} from '../../services/palette';
import {ChartEntityManager} from '../../wew/wew-bar-chart/chart-entity.model';

import 'rxjs/add/operator/toPromise';

type State = 'anim'|'error'|'loading'|'ready';

@Component({
	selector:'app-taxon-view',
	providers:[ApiTaxonService,ApiWewService,ChartEntityManager],
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
	
	//The taxon being viewed
	root:Taxon;
	//The group of the root taxon
	rootGroup:TaxonGroup;
	//List of taxa on the page
	taxonIds:Taxon[];
	//List of all taxon groups
	groups:TaxonGroup[];
	//List of all taxon levels
	levels:TaxonLevel[];
	//Config for the chart
	wewConfig:WewChartConfig;
	//Promise that resolves with a list of all groups
	private groupsPr:Promise<TaxonGroup[]>;
	
	constructor(
		private taxonApi:ApiTaxonService,
		private wewApi:ApiWewService,
		private chartEntityManager:ChartEntityManager,
		private route:ActivatedRoute
	){
		this.groupsPr = taxonApi.getGroups().toPromise();
		this.groupsPr.then(groups => this.groups = groups);
		taxonApi.getLevels().subscribe(levels => this.levels = levels);
	}
	
	ngOnInit(){
		this.route.params.map(params => parseInt(params.id)).subscribe(id => {
			let familyPr:Promise<Taxon[]> = this.taxonApi.getFamily(id).toPromise();
			
			familyPr.then(taxonIds => {
				this.taxonIds = taxonIds;
				//The taxon this page is about
				this.root = taxonIds.filter(taxon => taxon.id==id)[0];
				
				//Find what group the root taxon is in
				this.groupsPr.then(groups => {
					groups.forEach(group => {
						if(group.id===this.root.groupId)
							this.rootGroup = group;
					});
				});
				
				//The config for the wew chart
				this.wewConfig = {
					entities:[this.chartEntityManager.createFromTaxon(this.root,new MaterialPalette().shift())]
				};
				
				this.setState('ready');
			});
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
