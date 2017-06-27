export class Sample{
	id:number;
	date:Date;
	locationId:number;
	ownerId:number;
	quality:number;
	xCoor:number;
	yCoor:number;
	dateAdded:Date;
	taxonValues:Map<number/*taxonId*/,number/*value*/>;
	
	//Maps don't stringify
	public toJSON(){
		let taxonValuesObj = {};
		this.taxonValues.forEach((value,key) => taxonValuesObj[key] = value);
		
		return {
			id:this.id,
			date:this.date,
			locationId:this.locationId,
			ownerId:this.ownerId,
			quality:this.quality,
			xCoor:this.xCoor,
			yCoor:this.yCoor,
			dateAdded:this.dateAdded,
			taxonValues:taxonValuesObj
		};
		
	}
	
	public static fromJSON(obj):Sample{
		let sample = new Sample();
		sample.id = obj.id;
		sample.date = new Date(obj.date);
		sample.locationId = obj.locationId;
		sample.ownerId = obj.ownerId;
		sample.quality = obj.quality;
		sample.xCoor = obj.xCoor;
		sample.yCoor = obj.yCoor;
		sample.dateAdded = obj.dateAdded;
		sample.taxonValues = new Map();
		for(let key in obj.taxonValues){
			sample.taxonValues.set(parseInt(key,10),obj.taxonValues[key]);
		}
		return sample;
	}
}
