import {Component,OnInit} from '@angular/core';
import {MdDialog,MdDialogRef} from '@angular/material';

import {TaxonGroup} from '../taxon.model';
import {ApiTaxonService} from '../api.taxon.service';

@Component({
	selector:'app-taxon-manage-groups',
	providers:[ApiTaxonService],
	templateUrl:'./taxon-manage-groups.component.html',
	styleUrls:['./taxon-manage-groups.component.css']
})
export class TaxonManageGroupsComponent implements OnInit{
	groups:TaxonGroup[];
	
	icons = [null,'animals','animals-1','ant','ant-1','asparagus-beetle','bedbug','bee','big-mussel','big-shrimp','bug','bumblebee',
		'butterfly','butterfly-1','caterpillar','centipede','centipede-1','chrysomela','cicada','cockroach','cockroach-1','dragonfly',
		'dragonfly-1','dragonfly-hand-drawn-insect','earth-worm','earthworm-shape','firefly','fly','golden-ground-beetle','grasshopper',
		'hoverfly','insects','insects-1','ladybug','leaf-butterfly','leaf-insect','lobster','lobster-1','lobster-2','locust','louse',
		'madagascan','mite','mosquito','mosquito-1','mosquito-2','mosquito-3','mosquito-4','moth','mussel','opiliones','pollen-beetle',
		'pond-skater','psocoptera','pyrrhocoridae','red-soldier-beetle','sawfly','scorpio','shrimp','silverfish','snail','snail-1',
		'spider','spider-1','spider-black-widow','stag-beetle','stag-beetle-1','stick-insect','stone','strepsiptera','swamp-monster',
		'tarantula','termite','tree-lobster','tree-of-dots-foliage','wasp','wharf-borer','worm-facing-left','worm-outline-inside-a-circle'];
	
	constructor(
		private taxonApi:ApiTaxonService,
		private dialog:MdDialog
	){
		taxonApi.getGroups().subscribe(groups => {
			groups.sort((a,b) => a.code.localeCompare(b.code));
			groups.forEach(group => this.groups = groups);
		});
	}
	
	ngOnInit(){}
	
	edit(group:TaxonGroup){
		let dialogRef = this.dialog.open(TaxonManageGroupsEditComponent);
		dialogRef.componentInstance.parent = this;
		dialogRef.componentInstance.group = Object.assign(new TaxonGroup(),group);
	}
	
	save(group:TaxonGroup){
		this.groups.forEach((gr,index) => {
			if(gr.id==group.id)
				this.groups[index] = group;
		});
		this.taxonApi.saveGroups([group]).subscribe();
	}
}

@Component({
	selector:'app-taxon-manage-groups-edit',
	templateUrl:'./taxon-manage-groups-edit.component.html',
	styleUrls:['./taxon-manage-groups.component.css']
})
export class TaxonManageGroupsEditComponent{
	parent:TaxonManageGroupsComponent;
	group:TaxonGroup;
	
	constructor(public dialogRef:MdDialogRef<TaxonManageGroupsEditComponent>){}
	
	save(){
		this.group.description = this.group.description.toLowerCase();
		this.parent.save(this.group);
	}
}
