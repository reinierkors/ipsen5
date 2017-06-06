export class WEWValue{
	id:number;
	factorClassId:number;
	speciesId:number;
	value:number;
	
	public static fromJSON(obj):WEWValue{
		let value = new WEWValue();
		value.id = obj.id;
		value.factorClassId = obj.factorClassId;
		value.speciesId = obj.speciesId;
		value.value = obj.value;
		return value;
	}
}

export class WEWFactor{
	id:number;
	name:string;
	classes:WEWFactorClass[]
	
	public static fromJSON(obj):WEWFactor{
		let factor = new WEWFactor();
		factor.id = obj.id;
		factor.name = obj.name;
		factor.classes = obj.classes.map(WEWFactorClass.fromJSON);
		return factor;
	}
}

export class WEWFactorClass{
	id:number;
	factorId:number;
	code:string;
	description:string;
	
	public static fromJSON(obj):WEWFactorClass{
		let cl = new WEWFactorClass();
		cl.id = obj.id;
		cl.factorId = obj.factorId;
		cl.code = obj.code;
		cl.description = obj.description;
		return cl;
	}
}
