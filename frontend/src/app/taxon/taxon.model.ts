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

export class TaxonGroup{
	id:number;
	code:string;
	description:string;
	icon:string;
	
	public static fromJSON(obj:any):TaxonGroup{
		let group:TaxonGroup = new TaxonGroup();
		group.id = obj.id;
		group.code = obj.code;
		group.description = obj.description;
		group.icon = obj.icon;
		return group;
	}
}

export class TaxonLevel{
	id:number;
	name:string;
	
	public static fromJSON(obj:any):TaxonLevel{
		let level:TaxonLevel = new TaxonLevel();
		level.id = obj.id;
		level.name = obj.name;
		return level;
	}
}
