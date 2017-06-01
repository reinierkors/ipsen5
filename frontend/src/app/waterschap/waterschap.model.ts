export class Waterschap{
	id:number;
	name:string;
	
	public static fromJSON(obj:any):Waterschap{
		let ws:Waterschap = new Waterschap();
		ws.id = obj.id;
		ws.name = obj.name;
		return ws;
	}
}
