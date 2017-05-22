import { Component, OnInit } from '@angular/core';

import * as Papa from 'papaparse';

@Component({
  selector: 'app-sample-upload',
  templateUrl: './sample-upload.component.html',
  styleUrls: ['./sample-upload.component.css']
})
export class SampleUploadComponent implements OnInit {
	dataObjs:any[];
	
	constructor(){}
	
	ngOnInit(){}
	
	fileChange($event:any){
		let files:FileList = $event.target.files;
		this.dataObjs = [];
		for(let i=0;files.length;++i){
			let file = files.item(i);
			Papa.parse(file,{
				header:true,
				complete:(res,file)=>{
					this.dataObjs.push(res.data);
				},
				error:(res,file)=>{
					console.log("Oh snap",res,file);
				}
			});
		}
	}
	
	
}
