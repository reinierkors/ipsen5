import {Component,OnInit} from '@angular/core';
import {trigger,style,transition,animate,group,state} from '@angular/animations';

import {Sample} from '../sample.model';
import {MarkerLocation} from '../../locations/markerLocation.model';
import {Taxon} from '../../taxon/taxon.model';
import {Watertype} from '../../watertype/watertype.model';

import {ApiSampleService} from '../api.sample.service';
import {ApiTaxonService} from '../../taxon/api.taxon.service';
import {ApiLocationService} from '../../locations/api.location.service';
import {ApiWatertypeService} from '../../watertype/api.watertype.service';

import 'papaparse';

//The states an import process can be in
type ImportState = 'anim'|'start'|'loading'|'confirmData'|'confirmSample'|'finished'|'error';
//A row in a sample csv file
type SampleImport = {
	//Location code and description
	Mp:string, Locatie:string,
	//Parent watertype code and name
	'Code watertype':string, 'Naam watertype':string,
	//Water Framework Directive watertype code and name
	Krw_Code:string, Krw_Naam:string,
	//Rijksdriehoekscoördinaten
	'X-coor':number, 'Y-coor':number,
	//Date, ignore time, it'll always be empty
	Datum:string, Tijd:string,
	//Method used to obtain sample
	'Code methode':string, 'Naam methode':string, 'Eenheid methode':string,
	//Taxon name
	Taxonnaam:string,
	//Amount of taxa found in sample
	Waarde:number,
};

@Component({
	selector: 'app-sample-upload',
	providers: [ApiSampleService,ApiTaxonService,ApiLocationService,ApiWatertypeService],
	templateUrl: './sample-upload.component.html',
	styleUrls: ['./sample-upload.component.css'],
	animations:[
		trigger('mainCardAnim',[
			state('void',style({opacity:0})),
			transition(':enter',[animate('300ms 150ms',style({opacity:1}))]),
			transition(':leave',[animate('150ms', style({opacity:0}))])
		])
	]
})
export class SampleUploadComponent implements OnInit {
	//The state of the import process
	state:ImportState = 'start';
	//NextState is used to go to the correct state after an animated transition
	private nextState:ImportState;
	//Any errors that happen during the process
	errors:any[] = [];
	//All rows from all csv files
	private csvData:SampleImport[];
	
	//Map codes to objects
	private watertypeMap:Map<string,Watertype> = new Map();
	private locationMap:Map<string,MarkerLocation> = new Map();
	private taxonMap:Map<string,Taxon> = new Map();
	//Map ids to objects (only used when confirming samples)
	public locationIdsMap:Map<number,MarkerLocation> = new Map();
	public taxonIdsMap:Map<number,Taxon> = new Map();
	//Store parent relations
	private locationWatertype:Map<MarkerLocation,string/*watertype code*/> = new Map();
	private locationWatertypeKrw:Map<MarkerLocation,string/*watertype code*/> = new Map();
	
	//Data to conform on the page before saving to server
	confirm:{
		watertypes:Watertype[],
		locations:MarkerLocation[],
		taxa:Taxon[],
		samples:Sample[],
		samplesFast:any[]
	} = {watertypes:[],locations:[],taxa:[],samples:[],samplesFast:[]};
	
	constructor(
		private sampleApi:ApiSampleService,
		private taxonApi:ApiTaxonService,
		private locationApi:ApiLocationService,
		private watertypeApi:ApiWatertypeService

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
	
	//One or more files has been uploaded
	public fileChange($event:any){
		this.setState('loading');
		
		let files:FileList = $event.target.files;
		let filesArr:File[] = [];
		for(let i=0;i<files.length;++i){
			filesArr.push(files.item(i));
		}
		
		this.handleUploadedFiles(filesArr);
	}
	
	//Parse the files
	private handleUploadedFiles(files:File[]):void{
		Promise.all(files.map(this.parseCSV))
			.then(csvs => csvs.map(({result}) => result.data).reduce((arr,data)=>[...arr,...data]))
			.then(data => {
				data.forEach(row => {
					row['X-coor'] = parseInt(row['X-coor'],10);
					row['Y-coor'] = parseInt(row['Y-coor'],10);
					row['Waarde'] = parseInt(row['Waarde'],10);
				});
				this.csvData = data;
				this.handleRawData();
			});
	}
	
	//Calls PapaParse to turn the csv files into objects
	private parseCSV(file:File):Promise<{result:PapaParse.ParseResult,file:File}>{
		return new Promise((resolve,reject)=>{
			Papa.parse(file,{
				header:true,
				skipEmptyLines:true,
				complete:(result,file)=>resolve({result:result,file:file}),
				error:(result,file)=>reject({result:result,file:file}),
			});
		});
	}
	
	//Start with the sample subresources: watertypes, locations and taxon
	private handleRawData(){
		Promise.all([
			this.handleWatertypes(),
			this.handleLocations(),
			this.handleTaxa()
		]).then(()=>{
			if(this.confirm.locations.length+this.confirm.watertypes.length+this.confirm.taxa.length > 0)
				this.setState('confirmData');
			else
				this.createSamples();
		},(...params) => this.handleError(...params));
	}
	
	//Find all the watertypes in the data and retrieve existing ones from the server
	private handleWatertypes():Promise<null>{
		//Go through CSV data and create models for each watertype
		this.csvData.forEach(row => {
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
			},(...params) => this.handleError(...params));
		});
	}
	
	//Find all the locations in the data and retrieve existing ones from the server
	private handleLocations():Promise<null>{
		//Go through CSV data and create models for each location
		this.csvData.forEach(row => {
			if(!this.locationMap.has(row.Mp)){
				let location = new MarkerLocation();
				location.code = row.Mp;
				location.description = row.Locatie;
				location.xCoord = row['X-coor'];
				location.yCoord = row['Y-coor'];
				this.locationMap.set(row.Mp,location);
				//We don't have a watertype id yet, save relation for later
				this.locationWatertype.set(location,row['Code watertype']);
				this.locationWatertypeKrw.set(location,row.Krw_Code);
			}
		});
		let retrievePrs:Promise<MarkerLocation>[] = [];
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
		},this.handleError);
	}
	
	//Find all the taxa in the data and retrieve existing ones from the server
	private handleTaxa():Promise<null>{
		//Go through CSV data
		this.csvData.forEach(row => {
			if(!this.taxonMap.has(row.Taxonnaam)){
				let taxon = new Taxon();
				taxon.name = row.Taxonnaam;
				this.taxonMap.set(row.Taxonnaam,taxon);
			}
		});
		return new Promise((resolve,reject) => {
			//Retrieve existing taxon
			this.taxonApi.getByNames(Array.from(this.taxonMap.keys())).subscribe(taxa => {
				taxa.forEach(sp => this.taxonMap.set(sp.name,sp));
				//Show non-existing taxa for confirmation
				this.confirm.taxa = Array.from(this.taxonMap.values()).filter(taxon => !taxon.id);
				resolve();
			},(...params) => this.handleError(...params));
		});
	}
	
	//Saves all sample subresources to the server
	public confirmAll(){
		this.setState('loading');
		
		//Save all watertypes
		let waitForWatertypes:Promise<Watertype>[] = []
		this.confirm.watertypes.slice().forEach(watertype => waitForWatertypes.push(this.confirmWatertype(watertype)));
		
		//Save all taxa
		let waitForTaxa:Promise<Taxon[]> = this.confirmTaxa(this.confirm.taxa);
		
		Promise.all(waitForWatertypes).then(()=>{
			//Save all locations (watertypes have to be saved first)
			let waitForLocations:Promise<MarkerLocation>[] = [];
			this.confirm.locations.slice().forEach(location => waitForLocations.push(this.confirmLocation(location)));

			//Data this sample depends on is all saved, move on to creating the sample
			let allPromises:Promise<any>[] = [...waitForLocations,waitForTaxa];
			Promise.all(allPromises)
				.then(()=>{
					this.createSamples();
				},(...params) => this.handleError(...params));
		});
	}
	
	//Save a watertype to the server
	private confirmWatertype(watertype:Watertype):Promise<Watertype>{
		return new Promise((resolve,reject) => {
			this.watertypeApi.save(watertype).subscribe(saved => {
				watertype.id = saved.id;
				resolve(watertype);
			}, error => reject(error));
		});
	}
	
	//Save all locations to the server
	private confirmLocation(location:MarkerLocation):Promise<MarkerLocation>{
		return new Promise((resolve,reject) => {
			let watertype = this.watertypeMap.get(this.locationWatertype.get(location));
			let watertypeKrw = this.watertypeMap.get(this.locationWatertypeKrw.get(location));
			location.watertypeId = watertype.id;
			location.watertypeKrwId = watertypeKrw.id;
			this.locationApi.save(location).subscribe(saved => {
				location.id = saved.id;
				resolve(location);
			}, error => reject(error));
		});
	}
	
	//Save all taxa to the server
	private confirmTaxa(taxa:Taxon[]):Promise<Taxon[]>{
		return new Promise((resolve,reject) => {
			this.taxonApi.save(taxa).subscribe(saved => {
				resolve(saved);
			}, error => reject(error));
		});
	}
	
	//Create the sample objects
	private createSamples(){
		this.setState('loading');
		
		let sampleMap:Map<string,Sample> = new Map();
		this.csvData.forEach(row => {
			let sampleUnique = ""+row.Mp+row.Datum;
			let sample:Sample;
			if(sampleMap.has(sampleUnique)){
				sample = sampleMap.get(sampleUnique);
			}
			else{
				sample = new Sample();
				let [day,month,year] = row.Datum.split('/').map(n => parseInt(n,10));
				sample.date = new Date(year,month-1,day);
				sample.locationId = this.locationMap.get(row.Mp).id;
				sample.xCoor = row['X-coor'];
				sample.yCoor = row['Y-coor'];
				sample.taxonValues = new Map();
				sampleMap.set(sampleUnique,sample);
			}
			sample.taxonValues.set(this.taxonMap.get(row.Taxonnaam).id,row.Waarde);
		});
		
		Array.from(this.taxonMap.values()).forEach(taxon => this.taxonIdsMap.set(taxon.id,taxon));
		Array.from(this.locationMap.values()).forEach(location => this.locationIdsMap.set(location.id,location));
		this.confirm.samples = Array.from(sampleMap.values());
		
		//Increase template rendering by only storing what we need on the page
		this.confirm.samplesFast = this.confirm.samples.map(sample => {
			let taxonValuesFast = new Map<string,number>();
			sample.taxonValues.forEach((value,taxonId) => taxonValuesFast.set(this.taxonIdsMap.get(taxonId).name,value));
			return {
				locationCode:this.locationIdsMap.get(sample.locationId).code,
				locationDescription:this.locationIdsMap.get(sample.locationId).description,
				date:sample.date,
				taxonValues:taxonValuesFast
			};
		});
		
		this.setState('confirmSample');
	}
	
	//User agrees with all samples
	confirmSamples(){
		this.setState('loading');
		
		//Store all samples
		let waitForSamples:Promise<Sample[]> = new Promise((resolve,reject) => {
			this.sampleApi.saveMulti(this.confirm.samples).subscribe(samples => resolve(samples), err => reject(err));
		});
		
		//Go to finished when all samples are saved
		waitForSamples.then(samples => this.setState('finished'), (...params) => this.handleError(...params));
	}
	
	//Go back to the start of the importing process
	goToStart(){
		this.setState('start');
	}
}
