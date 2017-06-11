declare function shuffleArray(array:any[]);

//Returns an array of evenly spread hues
function hueList(count):number[]{
	let hues = new Array(count).fill(0).map((hue,index) => index*(360/count));
	return hues;
}

//shiftParts([1,2,3,4,5,6,7,8,9,10], 2) becomes [1,3,5,7,9,2,4,6,8,10]
//shiftParts([1,2,3,4,5,6,7,8,9,10], 3) becomes [1,4,7,10,2,5,8,3,6,9]
function shiftParts<T>(arr:T[],shift:number):T[]{
	let shiftedValues = [];
	for(let i=0,count=arr.length,take=0,takeStart=0;i<count;++i){
		shiftedValues.push(arr[take]);
		take += shift;
		if(take>=count){
			++takeStart;
			take = takeStart;
		}
	}
	return shiftedValues;
}

//Rotates array values
//rotate([1,2,3,4,5],1) becomes [2,3,4,5,1]
//rotate([1,2,3,4,5],2) becomes [3,4,5,1,2]
function rotate<T>(arr:T[],rotateBy:number):T[]{
	return [...arr.slice(rotateBy),...arr.slice(0,rotateBy)];
}

interface Color{
	asHSL():HSL;
	asRGB():RGB;
	toString():string;
}

//Class representing an HSL color
//H, S and L are in range 0.0 .. 1.0
class HSL implements Color{
	public constructor(
		public hue:number,
		public saturation:number,
		public lightness:number
	){}
	
	//Copy of itself
	public asHSL():HSL{
		return new HSL(this.hue,this.saturation,this.lightness);
	}
	
	//Convert to RGB
	public asRGB():RGB{
		let r,g,b;
		if(this.saturation==0){
			r = g = b = this.lightness;
		}
		else{
			let hue2rgb = (p,q,t) => {
				if(t<0)t += 1;
				if(t>1)t -= 1;
				if(t<1/6)return p + (q-p)*6*t;
				if(t<1/2)return q;
				if(t<2/3)return p + (q-p)*(2/3-t)*6;
				return p;
			};
			
			let q = this.lightness<.5 ? this.lightness*(1+this.saturation) : this.lightness+this.saturation-this.lightness*this.saturation;
			let p = 2*this.lightness-q;
			
			r = hue2rgb(p,q,this.hue+1/3);
			g = hue2rgb(p,q,this.hue);
			b = hue2rgb(p,q,this.hue-1/3);
		}
		return new RGB(r*255,g*255,b*255);
	}
	
	//Returns this color as hsl(h,s,l) string
	public toString():string{
		return `hsl(${this.hue*360},${this.saturation*100}%,${this.lightness*100}%)`;
	}
}

//Class representing an RGB color
//R, G and B are in range 0..255
class RGB implements Color{
	public constructor(
		public red:number,
		public green:number,
		public blue:number
	){}
	
	//Return copy of itself
	public asRGB():RGB{
		return new RGB(this.red,this.green,this.blue);
	}
	
	//Convert to HSL
	public asHSL():HSL{
		let r = this.red/255;
		let g = this.green/255;
		let b = this.blue/255;
		
		let max = Math.max(r,g,b);
		let min = Math.min(r,g,b);
		let h,s,l = (max+min)/2;

		if(max===min){
			h = s = 0;
		}
		else {
			let d = max-min;
			s = l>.5 ? d/(2-max-min) : d/(max+min);
			
			switch(max){
				case r: h = (g-b)/d + (g<b?6:0);break;
				case g: h = (b-r)/d + 2;break;
				case b: h = (r-g)/d + 4;break;
			}
			
			h /= 6;
		}
		
		return new HSL(h,s,l);
	}
	
	//Returns this color as rgb(r,g,b) string
	public toString():string{
		return `rgb(${this.red},${this.green},${this.blue})`;
	}
}

//A palette is a list of HSL or RGB colors
export abstract class Palette{
	public colors:Color[];
	public loop:boolean;
	
	public constructor(loop?:boolean){
		this.loop = loop==null?true:loop;
	}
	
	//When loop is off, index must be smaller than colors.length
	public colorAt(index:number):Color{
		return this.loop?this.colors[index%this.colors.length]:this.colors[index];
	}
	
	//Rotate the color palette
	public rotate(amount?:number):Palette{
		if(!amount)
			amount = Math.floor(Math.random()*this.colors.length)
		this.colors = rotate(this.colors,amount);
		return this;
	}
	
	//Shifts values within the palette apart from each other
	public shift(amount?:number):Palette{
		if(!amount)
			amount = Math.round(this.colors.length**.5)+1
		this.colors = shiftParts(this.colors,amount);
		return this;
	}
	
	//Reverses the order of colors in the palete
	public reverse():Palette{
		this.colors.reverse();
		return this;
	}
	
	//Randomizes the order of the palette
	public randomize():Palette{
		shuffleArray(this.colors);
		return this;
	}
	
	//Changes every color in the filter
	public transform(hue:number,saturation:number,lightness:number):Palette{
		this.colors = this.colors.map(color => {
			let c = color.asHSL();
			c.hue = Math.max(Math.min(c.hue+hue,1),0);
			c.saturation = Math.max(Math.min(c.saturation+saturation,1),0);
			c.lightness = Math.max(Math.min(c.lightness+lightness,1),0);
			return c;
		});
		return this;
	}
}

//A completely random color is given every time colorAt() is used
export class RandomPalette extends Palette{
	public constructor(){
		super(false);
		this.colors = [];
	}
	public colorAt(index?:number):Color{
		return new HSL(Math.floor(Math.random()*360),Math.round(Math.random()*100),Math.round(Math.random()*100));
	}
}

//A palette with different hues, but the saturation and lightness are set in the constructor
//The first parameter of the constructor determines how many colors there are in the palette
//A higher number means more different colors, but the colors will be more difficult to tell apart
export class HuePalette extends Palette{
	public constructor(howManyColors:number,saturation:number,lightness:number,loop?:boolean){
		super(loop);
		let hues = hueList(howManyColors);
		this.colors = hues.map(hue => new HSL(hue,saturation,lightness));
	}
}

//A palette of pastel colors
export class PastelPalette extends HuePalette{
	public constructor(howManyColors:number,loop?:boolean){
		super(howManyColors,1,.8,loop);
	}
}

//Dark colors
export class DarkPalette extends HuePalette{
	public constructor(howManyColors:number,loop?:boolean){
		super(howManyColors,1,.2,loop);
	}
}

//Colors with saturation and lightness at 50%
export class PlainPalette extends HuePalette{
	public constructor(howManyColors:number,loop?:boolean){
		super(howManyColors,.5,.5,loop);
	}
}

//Bright colors
export class BrightPalette extends HuePalette{
	public constructor(howManyColors:number,loop?:boolean){
		super(howManyColors,1,.5,loop);
	}
}

//Colors from https://material.io/guidelines/style/color.html#color-color-palette
export class MaterialPalette extends Palette{
	public constructor(loop?:boolean){
		super(loop);
		this.colors = [
			new RGB(244,67,54), new RGB(233,30,99), new RGB(156,39,176), new RGB(103,58,183),
			new RGB(63,81,181), new RGB(33,150,243), new RGB(0,188,212), new RGB(0,150,136),
			new RGB(76,175,80), new RGB(139,195,74), new RGB(205,220,57), new RGB(255,235,59),
			new RGB(255,152,0), new RGB(255,87,34)
		];
	}
}
