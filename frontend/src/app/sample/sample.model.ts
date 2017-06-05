export class Sample{
	id:number;
	date:Date;
	locationId:number;
	ownerId:number;
	quality:number;
	xCoor:number;
	yCoor:number;
	speciesIds:number[] = [];
	
	public static fromJSON(obj):Sample{
		var sample = new Sample();
		sample.id = obj.id;
		sample.date = new Date(obj.date);
		sample.locationId = obj.locationId;
		sample.ownerId = obj.ownerId;
		sample.quality = obj.quality;
		sample.xCoor = obj.xCoor;
		sample.yCoor = obj.yCoor;
		sample.speciesIds = obj.speciesIds;
		return sample;
	}
}
