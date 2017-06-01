import {Component,OnInit} from '@angular/core';

import {Sample} from '../sample.model';
import {Location} from '../../results/location.model';
import {Species} from '../../species/species.model';
import {Watertype} from '../../watertype/watertype.model';

import {ApiSampleService} from '../api.sample.service';
import {ApiSpeciesService} from '../../species/api.species.service';
import {ApiLocationService} from '../../results/api.location.service';
import {ApiWatertypeService} from '../../watertype/api.watertype.service';

import * as Papa from 'papaparse';

@Component({
	selector: 'app-sample-upload',
	providers: [ApiSampleService,ApiSpeciesService,ApiLocationService,ApiWatertypeService],
	templateUrl: './sample-upload.component.html',
	styleUrls: ['./sample-upload.component.css']
})
export class SampleUploadComponent implements OnInit {
	status:"start"|"loading"|"confirmData"|"confirmSample"|"finished" = "start";
	
	private watertypeMap:Map<string,Watertype> = new Map();
	private watertypeParents:Map<Watertype,string/*parent code*/> = new Map();
	private locationMap:Map<string,Location> = new Map();
	private locationWatertype:Map<Location,string/*watertype code*/> = new Map();
	private speciesMap:Map<string,Species> = new Map();
	
	confirm:{
		watertypes:Watertype[],
		locations:Location[],
		species:Species[],
		samples:Sample[]
	} = {watertypes:[],locations:[],species:[],samples:[]};
	
	constructor(
		private sampleApi:ApiSampleService,
		private speciesApi:ApiSpeciesService,
		private locationApi:ApiLocationService,
		private watertypeApi:ApiWatertypeService
	){}
	
	ngOnInit(){}
	
	public fileChange($event:any){
		this.status = "loading";
		let files:FileList = $event.target.files;
		let filesArr:File[] = [];
		for(let i=0;i<files.length;++i){
			filesArr.push(files.item(i));
		}
		this.handleUploadedFiles(filesArr);
	}
	
	private handleUploadedFiles(files:File[]):void{
		files.forEach(file=>{
			this.parseCSV(file).then(r => this.handleRawData(r));
		});
	}
	
	private parseCSV(file:File):Promise<{result:Papa.ParseResultWithHeader<any>,file:File}>{
		return new Promise((resolve,reject)=>{
			Papa.parse(file,{
				header:true,
				skipEmptyLines:true,
				complete:(result,file)=>resolve({result:result,file:file}),
				error:(result,file)=>reject({result:result,file:file}),
			});
		});
	}
	
	private handleWatertypes(result:Papa.ParseResultWithHeader<any>):Promise<null>{
		//Go through CSV data and create models for each watertype
		result.data.forEach(row => {
			//Parent watertype
			if(!this.watertypeMap.has(row['Code watertype'])){
				let wt:Watertype = new Watertype();
				wt.code = row['Code watertype'];
				wt.name = row['Naam watertype'];
				this.watertypeMap.set(row['Code watertype'],wt);
			}
			//Europese kaderrichtlijn water type
			if(!this.watertypeMap.has(row.Krw_Code)){
				let wt:Watertype = new Watertype();
				wt.code = row.Krw_Code;
				wt.name = row.Krw_Naam;
				this.watertypeMap.set(row.Krw_Code,wt);
				//We don't have a parent id yet, save relation for later
				this.watertypeParents.set(wt,row['Code watertype']);
			}
		});
		return new Promise((resolve,reject) => {
			//Retrieve existing watertypes
			this.watertypeApi.getAll().subscribe(watertypes => {
				watertypes.forEach(watertype => {
					if(this.watertypeMap.has(watertype.code))
						this.watertypeMap.set(watertype.code,watertype);
				});
				//Show non-existing watertypes for confirmation
				this.confirm.watertypes = Array.from(this.watertypeMap.values()).filter(watertype => !watertype.id);
				resolve();
			},reject);
		});
	}
	
	private handleLocations(result:Papa.ParseResultWithHeader<any>):Promise<null>{
		//Go through CSV data and create models for each location
		result.data.forEach(row => {
			if(!this.locationMap.has(row.Mp)){
				let location = new Location();
				location.code = row.Mp;
				location.description = row.Locatie;
				location.xCoord = row['X-coor'];
				location.yCoord = row['Y-coor'];
				this.locationMap.set(row.Mp,location);
				//We don't have a watertype id yet, save relation for later
				this.locationWatertype.set(location,row.Krw_Code);
			}
		});
		let retrievePrs:Promise<Location>[] = [];
		//Retrieve existing locations
		this.locationMap.forEach((_,locationCode) => {
			retrievePrs.push(new Promise((resolve,reject)=>{
				this.locationApi.getByCode(locationCode).subscribe(location => {
					this.locationMap.set(locationCode,location);
					resolve(location);
				}, ()=>resolve(location));
			}));
		});
		return Promise.all(retrievePrs).then(()=>{
			//Show non-existing locations for confirmation
			this.confirm.locations = Array.from(this.locationMap.values()).filter(location => !location.id);
		});
	}
	
	private handleSpecies(result:Papa.ParseResultWithHeader<any>):Promise<null>{
		//Go through CSV data
		result.data.forEach(row => {
			if(!this.speciesMap.has(row.Taxonnaam)){
				let species = new Species();
				species.name = row.Taxonnaam;
				this.speciesMap.set(row.Taxonnaam,species);
			}
		});
		return new Promise((resolve,reject) => {
			//Retrieve existing species
			this.speciesApi.getByNames(Array.from(this.speciesMap.keys())).subscribe(species => {
				species.forEach(sp => this.speciesMap.set(sp.name,sp));
				//Show non-existing species for confirmation
				this.confirm.species = Array.from(this.speciesMap.values()).filter(species => !species.id);
				resolve();
			},reject);
		});
	}
	
	private handleRawData({result,file}:{result:Papa.ParseResultWithHeader<any>,file:File}):void{
		Promise.all([
			this.handleWatertypes(result),
			this.handleLocations(result),
			this.handleSpecies(result)
		]).then(()=>{
			this.status = "confirmData";
		});
	}
	
	private confirmWatertype(watertype:Watertype):Promise<Watertype>{
		let needsConfirmation = this.confirm.watertypes.includes(watertype);
		
		if(needsConfirmation){
			//Remove from confirm list
			let index = this.confirm.watertypes.indexOf(watertype);
			if(index!==-1)
				this.confirm.watertypes.splice(index,1);
		}
		
		return new Promise((resolve,reject) => {
			//Is not waiting to be confirmed
			if(!needsConfirmation)
				return resolve(watertype);
			//Has a parent, confirm that first
			if(this.watertypeParents.has(watertype)){
				let parent = this.watertypeMap.get(this.watertypeParents.get(watertype));
				this.confirmWatertype(parent).then(parent => {
					watertype.parentId = parent.id;
					//Parent is confirmed, remove unknown relation, try again
					this.watertypeParents.delete(watertype);
					this.confirm.watertypes.push(watertype);
					return this.confirmWatertype(watertype);
				});
			}
			else{
				this.watertypeApi.save(watertype).subscribe(saved => {
					watertype.id = saved.id;
					return resolve(watertype);
				}, error => reject(error));
			}
		});
	}
	
	private confirmLocation(location:Location):Promise<Location>{
		let index = this.confirm.locations.indexOf(location);
		if(index!==-1)
			this.confirm.locations.splice(index,1);
		return new Promise((resolve,reject) => {
				let watertype = this.watertypeMap.get(this.locationWatertype.get(location));
				location.watertypeId = watertype.id;
				this.locationApi.save(location).subscribe(saved => {
					location.id = saved.id;
					return resolve(location);
				}, error => reject(error));
			});
	}
	
	private confirmSpecies(species:Species):Promise<Species>{
		let index = this.confirm.species.indexOf(species);
		if(index!==-1)
			this.confirm.species.splice(index,1);
		return new Promise((resolve,reject) => {
				this.speciesApi.save(species).subscribe(saved => {
					species.id = saved.id;
					return resolve(species);
				}, error => reject(error));
			});
	}
	
	public confirmAll(){
		//Save all watertypes
		let waitForWatertypes:Promise<Watertype>[] = [];
		this.confirm.watertypes.slice().forEach(watertype => waitForWatertypes.push(this.confirmWatertype(watertype)));
		
		//Save all locations (watertypes have to be saved first)
		let waitForLocations:Promise<Location>[] = [];
		Promise.all(waitForWatertypes).then(()=>{
			this.confirm.locations.slice().forEach(location => waitForLocations.push(this.confirmLocation(location)));
		});
		
		//Save all species
		let waitForSpecies:Promise<Species>[] = [];
		this.confirm.species.slice().forEach(species => waitForSpecies.push(this.confirmSpecies(species)));
		
		Promise.all([].concat(waitForLocations,waitForSpecies)).then(()=>{
			console.log('All is saved');
			this.status = "confirmSample";
		}, err => console.log(err));
		
		this.createSample();
	}
	
	private createSample(){
		console.log('Sample object maken');
	}
}
