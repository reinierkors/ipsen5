type WEWValueFormat = {i:number,c:number,s:number,v:number};

export class WEWValue{
	id:number;
	factorClassId:number;
	speciesId:number;
	value:number;
	
	//WEWValue is transferred between server and client in a different way than other classes, for performance reasons
	//Format: {i:id,c:factorClassId,s:speciesId,v:value}
	public toJSON():WEWValueFormat{
		return {
			i:this.id,
			c:this.factorClassId,
			s:this.speciesId,
			v:this.value
		};
	}
	
	public static fromJSON(obj:WEWValueFormat):WEWValue{
		let value = new WEWValue();
		value.id = obj.i;
		value.factorClassId = obj.c;
		value.speciesId = obj.s;
		value.value = obj.v;
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
