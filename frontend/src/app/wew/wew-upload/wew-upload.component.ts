import {Component,OnInit} from '@angular/core';
import {trigger,style,transition,animate,group,state} from '@angular/animations';

import {WEWValue,WEWFactor,WEWFactorClass} from '../wew.model';
import {ApiWewService} from '../api.wew.service';
import {Species} from '../../species/species.model';
import {ApiSpeciesService} from '../../species/api.species.service';

import * as XLSX from 'xlsx';

type ImportState = 'anim'|'start'|'loading'|'confirm'|'finished'|'error';

@Component({
	selector: 'app-wew-upload',
	providers:[ApiWewService,ApiSpeciesService],
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
	state:ImportState = 'start';
	private nextState:ImportState;
	errors:any[] = [];
	
	constructor(
		private wewApi:ApiWewService,
		private speciesApi:ApiSpeciesService
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
		return new Promise((resolve,reject) => {
			let reader = new FileReader();
			let name = file.name;
			reader.onload = function(e:any){
				let data = e.target.result;
				let arr = fixdata(data);
				let workbook = XLSX.read(btoa(arr), {type: 'base64'});
				resolve(workbook);
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
		let factors:WEWFactor[] = this.handleFactorSheet(factorSheet);
		let values:Promise<Map<WEWValue,WEWFactorClass>> = this.handleMatrixSheet(matrixSheet,factors);
		return new Promise((resolve,reject) => {
			values.then(values => resolve({factors:factors,values:values}),reject);
		});
	}
	
	//Reads all the factors and classes from the sheet
	private handleFactorSheet(factorSheet:XLSX.WorkSheet):WEWFactor[]{
		let rows:any[] = XLSX.utils.sheet_to_json(factorSheet);
		let factorMap:Map<string,WEWFactor> = new Map();
		let lastFactor:string;
		rows.forEach(row => {
			let factor:WEWFactor;
			if(row.factor){
				lastFactor = row.factor;
				factor = new WEWFactor();
				factor.name = row.factor;
				factor.classes = [];
				factorMap.set(factor.name,factor);
			}
			else{
				row.factor = lastFactor;
				factor = factorMap.get(row.factor);
			}
			let factorClass = new WEWFactorClass();
			factorClass.code = row.code;
			factorClass.description = row.klasse;
			factor.classes.push(factorClass);
		});
		//Zeldzaamheid is a special case, let's ignore it
		factorMap.delete("zeldzaamheid");
		
		return Array.from(factorMap.values());
	}
	
	//Reads all data from the wew matrix, maps it to species, factors and factorclasses
	private handleMatrixSheet(matrixSheet:XLSX.WorkSheet,factors:WEWFactor[]):Promise<Map<WEWValue,WEWFactorClass>>{
		//Map factor class codes to objects
		let factorClassMap:Map<string,WEWFactorClass> = new Map();
		factors.forEach(factor => factor.classes.forEach(cl => factorClassMap.set(cl.code,cl)));
		
		//Get the order of the factor classes in the columns
		let rows:any[] = XLSX.utils.sheet_to_json(matrixSheet,{raw:true,header:1});
		let factorClassColumns:WEWFactorClass[] = [];
		rows[1].forEach(col => factorClassColumns.push(factorClassMap.get(col)));
		
		//Get the species
		let speciesNames = rows.filter((row,index) => index>2).map(row => row[0]);
		let speciesPr:Promise<Species[]> = new Promise((resolve,reject) => {
			this.speciesApi.findOrCreate(speciesNames).subscribe(resolve,reject);
		});
		
		//Map species names to wew values
		let speciesValuesMap:Map<string,WEWValue[]> = new Map();
		let factorClassValuesMap:Map<WEWValue,WEWFactorClass> = new Map();
		
		//Get all values
		rows.forEach((row,index) => {
			if(index<3)
				return;
			let rowValues:WEWValue[] = [];
			factorClassColumns.forEach((factorClass,index) => {
				let value = new WEWValue();
				value.value = row[index+1]==='x'?null:row[index+1];
				rowValues.push(value);
				factorClassValuesMap.set(value,factorClass);
			});
			speciesValuesMap.set(row[0],rowValues);
		});
		
		//Species are in, store their ids in the values
		speciesPr.then(species => {
			species.forEach(spec => {
				speciesValuesMap.get(spec.name).forEach(value => value.speciesId = spec.id);
			});
		});
		
		//Return stuff
		return new Promise((resolve,reject) => {
			speciesPr.then(() => resolve(factorClassValuesMap),reject);
		});
	}
	
	//Saves all data to the server
	private saveData(factors:WEWFactor[],values:Map<WEWValue,WEWFactorClass>){
		//Save factors
		let factorClassMap:Map<string,WEWFactorClass> = new Map();
		this.wewApi.saveFactors(factors).subscribe(factors => {
			factors.forEach(factor => factor.classes.forEach(cl => factorClassMap.set(cl.code,cl)));
			
			//Set factor class ids in values
			values.forEach((factorClass,value) => {
				value.factorClassId = factorClassMap.get(factorClass.code).id;
			});
			
			//Save values
			this.wewApi.saveValues(Array.from(values.keys())).subscribe(values => {
				this.setState('finished');
				console.log('Alles is saved',factors,values);
			});
		});
	}
}
