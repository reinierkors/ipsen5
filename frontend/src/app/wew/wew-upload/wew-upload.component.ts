import {Component,OnInit} from '@angular/core';
import {trigger,style,transition,animate,group,state} from '@angular/animations';

import {WEWValue,WEWFactor,WEWFactorClass} from '../wew.model';
import {ApiWewService} from '../api.wew.service';
import {Taxon} from '../../taxon/taxon.model';
import {ApiTaxonService} from '../../taxon/api.taxon.service';

import * as XLSX from 'xlsx';

//States the importing process can be in
type ImportState = 'anim'|'start'|'loading'|'confirm'|'finished'|'error';

@Component({
	selector: 'app-wew-upload',
	providers:[ApiWewService,ApiTaxonService],
	templateUrl: './wew-upload.component.html',
	styleUrls: ['./wew-upload.component.css'],
	animations:[
		trigger('mainCardAnim',[
			state('void',style({opacity:0})),
			transition(':enter',[animate('300ms 150ms',style({opacity:1}))]),
			transition(':leave',[animate('150ms', style({opacity:0}))])
		])
	]
})
export class WewUploadComponent implements OnInit {
	//The current state of the import process
	state:ImportState = 'loading';
	//State to apply after an animation finishes
	private nextState:ImportState;
	//Any errors to show
	errors:any[] = [];
	//Are the wew tables empty?
	wewTablesEmpty:boolean;
	
	constructor(
		private wewApi:ApiWewService,
		private taxonApi:ApiTaxonService
	){
		//Check if the WEW tables are empty
		wewApi.areTablesEmpty().subscribe(bool => {
			this.wewTablesEmpty = bool;
			this.setState('start');
		});
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
	
	//Empty all wew tables
	public emptyWEWTables(){
		this.wewApi.emptyAllTables().subscribe(bool => this.wewTablesEmpty = bool, (...params)=>this.handleError(...params));
	}
	
	//A file is choses from the upload page
	fileChange($event){
		this.setState('loading');
		let files:FileList = $event.target.files;
		let file = files.item(0);
		this.handleFile(file).then(wb => this.handleWorkBook(wb)).then(({factors,values}) => this.saveData(factors,values)).catch((...params) => this.handleError(...params));
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
	private handleWorkBook(wb:XLSX.WorkBook):Promise<{factors:WEWFactor[],values:Map<WEWValue,WEWFactorClass>}>{
		let matrixSheet = wb.Sheets[wb.SheetNames[0]];
		let factorSheet = wb.Sheets[wb.SheetNames[1]];
		//Get factors from the factor sheet
		let factors:WEWFactor[] = this.handleFactorSheet(factorSheet);
		//Get values from the matrix sheet
		let values:Promise<Map<WEWValue,WEWFactorClass>> = this.handleMatrixSheet(matrixSheet,factors);
		//Resolve with all factors and values
		return new Promise((resolve,reject) => {
			values.then(values => resolve({factors:factors,values:values}),reject);
		});
	}
	
	//Reads all the factors and classes from the sheet
	private handleFactorSheet(factorSheet:XLSX.WorkSheet):WEWFactor[]{
		//Turn the worksheet in a 2D array
		let rows:any[] = XLSX.utils.sheet_to_json(factorSheet);
		//Maps factor names to factor objects
		let factorMap:Map<string/*factor name*/,WEWFactor> = new Map();
		//Factor name doesn't repeat on every row, so keep track of the last one
		let lastFactor:string;
		
		rows.forEach((row,index) => {
			let factor:WEWFactor;
			//Row contains a new factor name, create object
			if(row.factor){
				lastFactor = row.factor;
				factor = new WEWFactor();
				factor.name = row.factor.trim();
				factor.classes = [];
				factorMap.set(factor.name,factor);
			}
			//Use the previous one
			else{
				row.factor = lastFactor;
				factor = factorMap.get(row.factor);
			}
			//Create a factor class for this row
			let factorClass = new WEWFactorClass();
			factorClass.code = row.code.trim();
			factorClass.description = row.klasse.trim();
			factorClass.order = index;
			//Store it in the current factor
			factor.classes.push(factorClass);
		});
		//Zeldzaamheid is a special case, its rows in this sheet are not factor classes but possible values
		//We don't have plans on visualizing this any time soon, so ignore it for now
		factorMap.delete('zeldzaamheid');
		
		return Array.from(factorMap.values());
	}
	
	//Reads all data from the wew matrix, maps it to taxon, factors and factorclasses
	private handleMatrixSheet(matrixSheet:XLSX.WorkSheet,factors:WEWFactor[]):Promise<Map<WEWValue,WEWFactorClass>>{
		//Map factor class codes to objects
		let factorClassMap:Map<string,WEWFactorClass> = new Map();
		factors.forEach(factor => factor.classes.forEach(cl => factorClassMap.set(cl.code,cl)));
		
		//Convert the sheet to 2D array
		let rows:any[] = XLSX.utils.sheet_to_json(matrixSheet,{raw:true,header:1});
		
		//Get the order of the factor classes in the columns
		let factorClassColumns:WEWFactorClass[] = [];
		rows[1].filter(field => field.trim().length).forEach(code => factorClassColumns.push(factorClassMap.get(code)));
		
		//Store the short description of each factor class instead of the long one
		//TODO: should we store both?
		rows[2].forEach((desc,index) => {
			if(index==0)
				return;
			let factorClass = factorClassColumns[index-1];
			if(factorClass)
				factorClass.description = desc.trim();
		});
		
		//Get the taxon
		let taxonNames = rows.filter((row,index) => index>2).map(row => row[0].trim().toLowerCase());
		let taxonPr:Promise<Taxon[]> = new Promise((resolve,reject) => {
			this.taxonApi.findOrCreate(taxonNames).subscribe(resolve,reject);
		});
		
		//Map taxon names to wew values
		let taxonValuesMap:Map<string/*taxon name*/,WEWValue[]> = new Map();
		let factorClassValuesMap:Map<WEWValue,WEWFactorClass> = new Map();
		
		//Get all values, every row is a taxon
		rows.forEach((row,index) => {
			//First 3 rows of the sheet are headers, ignore them
			if(index<3)
				return;
			
			let rowValues:WEWValue[] = [];
			
			//Store every field in this row as a WEWValue
			factorClassColumns.forEach((factorClass,index) => {
				let value = new WEWValue();
				//'x' means null in this sheet
				value.value = row[index+1]==='x'?null:row[index+1];
				
				rowValues.push(value);
				factorClassValuesMap.set(value,factorClass);
			});
			
			//Map the taxon name of this row to all values on the row
			taxonValuesMap.set(row[0].trim().toLowerCase(),rowValues);
		});
		
		//Taxon are in, store their ids in the values
		taxonPr.then(taxonIds => {
			taxonIds.forEach(taxon => {
				taxonValuesMap.get(taxon.name.trim().toLowerCase()).forEach(value => value.taxonId = taxon.id);
			});
		});
		
		//Return a promise that resolves with a Map<WEWValue,WEWFactorClass>
		//FactorClasses aren't saved yet, so without IDs, this map saves the relation
		return new Promise((resolve,reject) => {
			taxonPr.then(() => resolve(factorClassValuesMap),reject);
		});
	}
	
	//Saves all data to the server
	private saveData(factors:WEWFactor[],values:Map<WEWValue,WEWFactorClass>){
		let factorClassMap:Map<string/*factor class code*/,WEWFactorClass> = new Map();
		//Save factors and factor classes in them
		this.wewApi.saveFactors(factors).subscribe(factors => {
			//Put them in the map for lookup
			factors.forEach(factor => factor.classes.forEach(cl => factorClassMap.set(cl.code,cl)));
			
			//Set factor class ids in values
			values.forEach((factorClass,value) => {
				value.factorClassId = factorClassMap.get(factorClass.code).id;
			});
			
			//Save values
			this.wewApi.saveValues(Array.from(values.keys())).subscribe(() => {
				//Show the end page
				this.setState('finished');
			}, (...params)=>this.handleError(...params));
		}, (...params)=>this.handleError(...params));
	}
}
