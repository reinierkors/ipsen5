import {Component,OnInit} from '@angular/core';
import {trigger,style,transition,animate,group,state} from '@angular/animations';

import {ApiTaxonService} from '../api.taxon.service';
import {Taxon} from '../taxon.model';

import * as XLSX from 'xlsx';

//The states an import process can be in
type ImportState = 'anim'|'start'|'loading'|'confirm'|'finished'|'error';
//The columns of the sheet
export type Taxonx = {expanded,taxontype,taxoncode,taxonname,author,taxongroup,taxonlevel,parentname,refername,literature,localname,date,status,parentObject,children:Taxon[],nlGroup,isRefer};

export var NLMap:Map<string,string> = new Map();

[
	['APHIR','bloedzuigers'],
	['APOLI','ringwormen'],
	['APPOL','borstelwormen'],
	['APTUR','platwormen'],
	['ARACH','mijten'],
	['BRHYP','mosdiertjes'],
	['CRAMP','vlokreeften'],
	['CRDEC','kreeften en garnalen'],
	['CRISO','pissebedden'],
	['CRMYS','aasgarnalen'],
	['IDCHI','dansmuggen'],
	['IDREM','overige vliegen en muggen'],
	['IDSIM','kriebelmuggen'],
	['INCOL','kevers'],
	['INEPH','haften'],
	['INHET','wantsen'],
	['INLEP','vlinders'],
	['INODO','libellen'],
	['INREM','steenvliegen'],
	['INTRI','schietmotten'],
	['MOBIV','tweekleppigen'],
	['MOGAS','slakken']
].forEach(row => NLMap.set(row[0],row[1]));


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
	
	//The taxons from the file
	taxons:Taxonx[];
	
	constructor(
		private apiService:ApiTaxonService
	){}
	
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
		setTimeout(()=>{
			this.handleFile(file).then(wb => this.handleWorkBook(wb));
		},1000);
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
	private handleWorkBook(wb:XLSX.WorkBook):void{
		//Get the first sheet from the workbook
		let sheet = wb.Sheets[wb.SheetNames[0]];
		//Turn the worksheet in a 2D array
		let rows = XLSX.utils.sheet_to_json(sheet);
		
		//Map taxon names to their objects
		let taxMap:Map<string/*taxon name*/,Taxonx> = new Map();
		rows.forEach((row:Taxonx) => {
			row.children = [];
			row.expanded = row.taxonlevel!=='Genus';
			taxMap.set(row.taxonname,row)
		});
		
		//Create hierarchy
		taxMap.forEach(tax => {
			if(tax.refername){
				tax.isRefer = true;
				tax.parentObject = taxMap.get(tax.refername);
			}
			else{
				tax.parentObject = taxMap.get(tax.parentname);
			}
			if(tax.parentObject)
				tax.parentObject.children.push(tax);
			tax.nlGroup = NLMap.get(tax.taxongroup);
		});
		
		//Make array of only the parents
		let taxons:Taxonx[] = Array.from(taxMap.values()).filter(row => !row.parentObject);
		
		this.taxons = taxons;
		
		this.setState('confirm');
	}
}
