import {Component,OnInit} from '@angular/core';
import {trigger,style,transition,animate,group,state} from '@angular/animations';

import {WEWValue,WEWFactor,WEWFactorClass} from '../wew.model';

import * as XLSX from 'xlsx';

type ImportState = 'anim'|'start'|'loading'|'confirm'|'finished'|'error';

@Component({
	selector: 'app-wew-upload',
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
	
	constructor(){}
	
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
	
	fileChange($event){
		this.setState('loading');
		let files:FileList = $event.target.files;
		let file = files.item(0);
		this.handleFile(file).then(wb => this.handleWorkBook(wb));
	}
	
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
	
	private handleWorkBook(wb:XLSX.WorkBook){
		let matrixSheet = wb.Sheets[wb.SheetNames[0]];
		let factorSheet = wb.Sheets[wb.SheetNames[1]];
		let factors = this.handleFactorSheet(factorSheet);
		let values = this.handleMatrixSheet(matrixSheet);
		
	}
	
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
		return Array.from(factorMap.values());
	}

	private handleMatrixSheet(matrixSheet:XLSX.WorkSheet):WEWValue[]{
		
		return [];
	}
}
