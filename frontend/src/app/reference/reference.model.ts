export class Reference{
	id:number;
	watertypeId:number;
	taxonIds:number[];
	
	public static fromJSON(obj):Reference{
		let reference = new Reference();
		reference.id = obj.id;
		reference.watertypeId = obj.watertypeId;
		reference.taxonIds = obj.taxonIds;
		return reference;
	}
}
