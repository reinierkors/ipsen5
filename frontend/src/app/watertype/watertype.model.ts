export class Watertype {
	id: number;
	name: string;
	code: string;

	public static fromJSON(obj: any): Watertype {
		let wt: Watertype = new Watertype();
		wt.id = obj.id;
		wt.name = obj.name;
		wt.code = obj.code;
		return wt;
	}
}
