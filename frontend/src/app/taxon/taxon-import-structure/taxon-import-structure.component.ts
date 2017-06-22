import {Component,OnInit} from '@angular/core';
import {trigger,style,transition,animate,group,state} from '@angular/animations';

import {ApiTaxonService} from '../api.taxon.service';
import {Taxon,TaxonGroup,TaxonLevel} from '../taxon.model';
import {uniqueFilter} from '../../services/arrayUtils';

import * as XLSX from 'xlsx';

//The states an import process can be in
type ImportState = 'anim'|'start'|'loading'|'confirm'|'finished'|'error';

//The columns of the sheet
type ImportRow = {taxontype,taxoncode,taxonname,author,taxongroup,taxonlevel,parentname,refername,literature,localname,date,status};


@Component({
	selector:'app-taxon-import-structure',
	providers:[ApiTaxonService],
	templateUrl:'./taxon-import-structure.component.html',
	styleUrls:['./taxon-import-structure.component.css'],
	animations:[
		trigger('mainCardAnim',[
			state('void',style({opacity:0})),
			transition(':enter',[animate('300ms 150ms',style({opacity:1}))]),
			transition(':leave',[animate('150ms', style({opacity:0}))])
		])
	]
})
export class TaxonImportStructureComponent implements OnInit{
	//The state of the import process
	state:ImportState = 'start';
	//NextState is used to go to the correct state after an animated transition
	private nextState:ImportState;
	//Any errors that happen during the process
	errors:any[] = [];
	
	private groupPr:Promise<TaxonGroup[]>;
	private levelPr:Promise<TaxonLevel[]>;
	
	constructor(
		private taxonApi:ApiTaxonService
	){
		//Retrieve known taxon groups and levels
		this.groupPr = new Promise((resolve,reject) => this.taxonApi.getGroups().subscribe(groups => resolve(groups), err => reject(err)));
		this.levelPr = new Promise((resolve,reject) => this.taxonApi.getLevels().subscribe(levels => resolve(levels), err => reject(err)));
	}
	
	ngOnInit(){}
	
	//Set the state of the importing process
	private setState(state:ImportState){
		this.state = 'anim';
		this.nextState = state;
	}
	
	//Go to the next state when the :leave animation finishes
	mainCardAnimDone($event){
		if($event.toState==='void'){
			this.state = this.nextState;
		}
	}
	
	//ToDo: improve error handling
	//Right now we just print the array as json on the page
	public handleError(...error){
		this.setState('error');
		this.errors.push(error);
	}
	
	//A file is choses from the upload page
	fileChange($event){
		this.setState('loading');
		let files:FileList = $event.target.files;
		let file = files.item(0);
		this.importFile(file);
	}
	
	//Take care of the whole importing process
	private importFile(file:File){
		this.handleFile(file)
			.then(wb => this.handleWorkBook(wb))
			.then(({taxonIds,parentMap,referMap}) => this.saveTaxa(taxonIds,parentMap,referMap));
	}
	
	//Reads and parses the file and turns it into a workbook
	private handleFile(file:File):Promise<XLSX.WorkBook>{
		//Require by XLSX when using readAsArrayBuffer
		function fixdata(data) {
			let o = "", l = 0, w = 10240;
			for(; l<data.byteLength/w; ++l)
				o += String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
			o += String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w)));
			return o;
		}
		
		//Resolves when the file is parsed and available as XLSX.WorkBook
		return new Promise((resolve,reject) => {
			let reader = new FileReader();
			let name = file.name;
			reader.onload = function(e:any){
				setTimeout(()=>{
					let data = e.target.result;
					let arr = fixdata(data);
					let workbook = XLSX.read(btoa(arr), {type: 'base64'});
					resolve(workbook);
				});
			};
			reader.onerror = function(e){
				reject(e);
			}
			
			reader.readAsArrayBuffer(file);
		});
	}
	
	//Start work on the workbook once XLSX has parsed the file
	private handleWorkBook(wb:XLSX.WorkBook):Promise<{taxonIds:Taxon[],parentMap:Map<string,string>,referMap:Map<string,string>}>{
		//Get the first sheet from the workbook
		let sheet = wb.Sheets[wb.SheetNames[0]];
		//Turn the worksheet in a 2D array
		let rows = <ImportRow[]> XLSX.utils.sheet_to_json(sheet);
		
		//Trim spaces and make lower case
		rows.forEach(row => {
			row.taxonname = row.taxonname.trim().toLowerCase();
			row.taxongroup = row.taxongroup.trim();
			row.taxonlevel = row.taxonlevel.trim();
			row.parentname = row.parentname.trim().toLowerCase();
			row.refername = row.refername.trim().toLowerCase();
		});
		
		//Take care of the taxon groups and levels
		this.groupPr = this.groupPr.then(groups => this.handleGroups(rows,groups));
		this.levelPr = this.levelPr.then(levels => this.handleLevels(rows,levels));
		
		//Groups and levels are all saved and available
		//Turn rows into taxon objects
		return Promise.all([this.groupPr,this.levelPr])
			.then(([groups,levels]) => this.handleRows(rows,groups,levels))
	}
	
	//Creates groups that don't exist yet
	private handleGroups(rows:ImportRow[],groups:TaxonGroup[]):Promise<TaxonGroup[]>{
		//Existing groups
		let groupMap:Map<string/*group code*/,TaxonGroup> = new Map();
		groups.forEach(group => groupMap.set(group.code,group));
		
		//New groups from the import
		let newGroups = rows.map(row => row.taxongroup)
			.filter(uniqueFilter)
			.filter(code => code)
			.filter(code => !groupMap.has(code))
			.map(code => {
				let group = new TaxonGroup();
				group.code = code;
				return group;
			});
		
		//Return groups array if no new ones are being imported
		if(!newGroups.length)
			return Promise.resolve(groups);
		
		//Save them and return a promise
		return new Promise((resolve,reject) => {
			this.taxonApi.saveGroups(newGroups).subscribe(newGroups => {
				resolve([...groups,...newGroups]);
			},error => reject(error));
		});
	}
	
	//Creates levels that don't exist yet
	private handleLevels(rows:ImportRow[],levels:TaxonLevel[]):Promise<TaxonLevel[]>{
		//Existing levels
		let levelMap:Map<string/*level name*/,TaxonLevel> = new Map();
		levels.forEach(level => levelMap.set(level.name,level));
		
		//New levels from the import
		let newLevels = rows.map(row => row.taxonlevel)
			.filter(uniqueFilter)
			.filter(name => name)
			.filter(name => !levelMap.has(name))
			.map(name => {
				let level = new TaxonLevel();
				level.name = name;
				return level;
			});
		
		//Return levels array if no new ones are being imported
		if(!newLevels.length)
			return Promise.resolve(levels);
		
		//Save them and return a promise
		return new Promise((resolve,reject) => {
			this.taxonApi.saveLevels(newLevels).subscribe(newLevels => {
				resolve([...levels,...newLevels]);
			},error => reject(error));
		});
	}
	
	//Turn the rows into objects that can be saved to the server
	private handleRows(rows:ImportRow[],groups:TaxonGroup[],levels:TaxonLevel[]):{taxonIds:Taxon[],parentMap:Map<string,string>,referMap:Map<string,string>}{
		//Map taxon names to their objects
		let taxonRowMap:Map<string/*taxon name*/,ImportRow> = new Map();
		rows.forEach(row => taxonRowMap.set(row.taxonname,row));
		
		//Easy lookup for groups and levels
		let groupMap:Map<string/*group code*/,TaxonGroup> = new Map();
		let levelMap:Map<string/*level name*/,TaxonLevel> = new Map();
		groups.forEach(group => groupMap.set(group.code,group));
		levels.forEach(level => levelMap.set(level.name,level));
		
		//Store parent and refer relations for after stuff is saved, as we don't know the ids yet
		let parentMap:Map<string/*child name*/,string/*parent name*/> = new Map();
		let referMap:Map<string/*referring name*/,string/*being referred to name*/> = new Map();
		
		//Create taxon objects
		let taxonIds:Taxon[] = rows.map(row => {
			let taxon = new Taxon();
			taxon.name = row.taxonname;
			
			if(row.taxongroup)
				taxon.groupId = groupMap.get(row.taxongroup).id;
			if(row.taxonlevel)
				taxon.levelId = levelMap.get(row.taxonlevel).id;
			
			//Store parents and refers for later
			if(row.parentname)
				parentMap.set(row.taxonname,row.parentname);
			if(row.refername)
				referMap.set(row.taxonname,row.refername);
			
			return taxon;
		});
		
		return {taxonIds:taxonIds,parentMap:parentMap,referMap:referMap};
	}
	
	private saveTaxa(taxonIds:Taxon[],parentMap:Map<string,string>,referMap:Map<string,string>):void{
		this.taxonApi.saveMerge(taxonIds).subscribe((taxonIds:Taxon[]) => {
			//Create new lookup map
			let taxonNameMap:Map<string,Taxon> = new Map();
			taxonIds.forEach(taxon => taxonNameMap.set(taxon.name,taxon));
			
			//Set parent and refer relations
			let changed:Taxon[] = [];
			taxonIds.forEach(taxon => {
				if(parentMap.has(taxon.name)){
					taxon.parentId = taxonNameMap.get(parentMap.get(taxon.name)).id;
					changed.push(taxon);
				}
				else if(referMap.has(taxon.name)){
					taxon.referId = taxonNameMap.get(referMap.get(taxon.name)).id;
					changed.push(taxon);
				}
			});
			
			//Save the changed ones
			this.taxonApi.save(changed).subscribe(changed => {
				this.setState('finished');
			});
		});
	}
	
}
