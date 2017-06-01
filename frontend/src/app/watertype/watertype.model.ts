export class Watertype{
	id:number;
	name:string;
	code:string;
	parentId:number;
	
	public static fromJSON(obj:any):Watertype{
		let wt:Watertype = new Watertype();
		wt.id = obj.id;
		wt.name = obj.name;
		wt.code = obj.code;
		wt.parentId = obj.parentId;
		return wt;
	}
}
