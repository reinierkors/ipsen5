export class Sample{
	id:number;
	date:Date;
	locationId:number;
	ownerId:number;
	quality:number;
	xCoor:number;
	yCoor:number;
	speciesValues:Map<number/*speciesId*/,number/*value*/>;
	
	//Maps don't stringify
	public toJSON(){
		let speciesValuesObj = {};
		this.speciesValues.forEach((value,key) => speciesValuesObj[key] = value);
		
		return {
			id:this.id,
			date:this.date,
			locationId:this.locationId,
			ownerId:this.ownerId,
			quality:this.quality,
			xCoor:this.xCoor,
			yCoor:this.yCoor,
			speciesValues:speciesValuesObj
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
		sample.speciesValues = new Map();
		for(let key in obj.speciesValues){
			sample.speciesValues.set(parseInt(key,10),obj.speciesValues[key]);
		}
		return sample;
	}
}
