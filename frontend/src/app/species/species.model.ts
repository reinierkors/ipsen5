export class Species{
	id:number;
	name:string;
	categoryId:number;
	
	public static fromJSON(obj:any):Species{
		let species:Species = new Species();
		species.id = obj.id;
		species.name = obj.name;
		species.categoryId = obj.categoryId;
		return species;
	}
}
