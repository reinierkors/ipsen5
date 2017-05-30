import {Component,OnInit} from '@angular/core';

import {Sample} from '../sample.model';

import * as Papa from 'papaparse';
import * as _ from 'lodash';

@Component({
  selector: 'app-sample-upload',
  templateUrl: './sample-upload.component.html',
  styleUrls: ['./sample-upload.component.css']
})
export class SampleUploadComponent implements OnInit {
	dataObjs:any[];
	
	constructor(){}
	
	ngOnInit(){}
	
	public fileChange($event:any){
		let files:FileList = $event.target.files;
		let filesArr:File[] = [];
		for(let i=0;i<files.length;++i){
			filesArr.push(files.item(i));
		}
		this.handleUploadedFiles(filesArr);
	}
	
	private handleUploadedFiles(files:File[]):void{
		files.forEach(file=>{
			this.parseCSV(file)
				.then(this.transformRawData)
				.then(this.showDataVerification);
		});
	}
	
	private parseCSV(file:File):Promise<{result:Papa.ParseResultWithHeader<any>,file:File}>{
		return new Promise((resolve,reject)=>{
			Papa.parse(file,{
				header:true,
				complete:(result,file)=>resolve({result:result,file:file}),
				error:(result,file)=>reject({result:result,file:file}),
			});
		});
	}
	
	private transformRawData({result,file}:{result:Papa.ParseResultWithHeader<any>,file:File}):Promise<{samples:Sample[],file:File}>{
		let locationMap:Map<String,null/*Location*/> = new Map();
		let speciesMap:Map<String,null/*Species*/> = new Map();
		let waterTypeMap:Map<String,null/*WaterType*/> = new Map();
		
		//Add every location, species and watertype to their maps
		result.data.forEach(row => {
			if(!locationMap.has(row.Mp))
				locationMap.set(row.Mp,null);
			if(!speciesMap.has(row.Taxonnaam))
				speciesMap.set(row.Taxonnaam,null);
			if(!waterTypeMap.has(row.Krw_Code))
				waterTypeMap.set(row.Krw_Code,null);
		});
		
		//Retrieving existing ones from the server (not yet implemented)
		locationMap.forEach((_,locationCode) => {
			//LocationApi.getByCode(locationCode).subscribe(location => locationMap.set(locationCode,location));
		});
		speciesMap.forEach((_,speciesName) => {
			//speciesnApi.getByName(speciesName).subscribe(species => speciesMap.set(speciesName,species));
		});
		waterTypeMap.forEach((_,waterTypeCode) => {
			//waterTypeApi.getByCode(waterTypeCode).subscribe(waterType => waterTypeMap.set(waterTypeCode,waterType));
		});
		
		//Create samples
		let sampleMap:Map<String,Sample> = new Map();
		result.data.forEach(row => {
			let sampleUnique = ''+row['Mp']+row['Datum'];
			let sample:Sample;
			if(sampleMap.has(sampleUnique)){
				sample = sampleMap.get(sampleUnique);
			}
			else{
				sample = new Sample();
				sampleMap.set(sampleUnique,sample);
			}
			
		});
		
		return null;
	}
	
	private showDataVerification({samples,file}:{samples:Sample[],file:File}):void{
		console.log('Samples need to be shown and verified');
	}
}
