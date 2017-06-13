export class Taxon{
	id:number;
	name:string;
	groupId:number;
	levelId:number;
	parentId:number;
	referId:number;
	
	public static fromJSON(obj:any):Taxon{
		let taxon:Taxon = new Taxon();
		taxon.id = obj.id;
		taxon.name = obj.name;
		taxon.groupId = obj.groupId;
		taxon.levelId = obj.levelId;
		taxon.parentId = obj.parentId;
		taxon.referId = obj.referId;
		return taxon;
	}
}
