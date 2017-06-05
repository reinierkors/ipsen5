import {Component,OnInit} from '@angular/core';
import {trigger,style,transition,animate,group,state} from '@angular/animations';

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
		
		//Require by XLSX when using readAsArrayBuffer
		function fixdata(data) {
			let o = "", l = 0, w = 10240;
			for(; l<data.byteLength/w; ++l)
				o += String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w,l*w+w)));
			o += String.fromCharCode.apply(null,new Uint8Array(data.slice(l*w)));
			return o;
		}
		
		let reader = new FileReader();
		let name = file.name;
		reader.onload = function(e:any){
			let data = e.target.result;
			let arr = fixdata(data);
			let workbook = XLSX.read(btoa(arr), {type: 'base64'});
			
			console.log(workbook);
		};
		reader.readAsArrayBuffer(file);
	}
}
