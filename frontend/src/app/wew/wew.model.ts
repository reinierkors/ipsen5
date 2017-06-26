type WEWValueFormat = {i:number,c:number,t:number,v:number};

export class WEWValue{
	id:number;
	factorClassId:number;
	taxonId:number;
	value:number;
	
	//WEWValue is transferred between server and client in a different way than other classes, for performance reasons
	//Format: {i:id,c:factorClassId,t:taxonId,v:value}
	public toJSON():WEWValueFormat{
		return {
			i:this.id,
			c:this.factorClassId,
			t:this.taxonId,
			v:this.value
		};
	}
	
	public static fromJSON(obj:WEWValueFormat):WEWValue{
		let value = new WEWValue();
		value.id = obj.i;
		value.factorClassId = obj.c;
		value.taxonId = obj.t;
		value.value = obj.v;
		return value;
	}
}

export class SimpleWEWValue{
	factorClassId:number;
	value:number;
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
	order:number;
	
	public static fromJSON(obj):WEWFactorClass{
		let cl = new WEWFactorClass();
		cl.id = obj.id;
		cl.factorId = obj.factorId;
		cl.code = obj.code;
		cl.description = obj.description;
		cl.order = obj.order;
		return cl;
	}
}
