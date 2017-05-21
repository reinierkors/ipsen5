export class Sample{
	id:number;
	datetime:Date;
	locationId:number;
	ownerId:number;
	quality:number;
	latitude:number;
	longitude:number;
	
	public static fromJSON(obj):Sample{
		var sample = new Sample();
		sample.id = obj.id;
		sample.datetime = new Date(obj.datetime);
		sample.locationId = obj.locationId;
		sample.ownerId = obj.ownerId;
		sample.quality = obj.quality;
		sample.latitude = obj.latitude;
		sample.longitude = obj.longitude;
		return sample;
	}
}
