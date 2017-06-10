declare function shuffleArray(array:any[]);

//Returns an array of evenly spread hues
function hueList(count):number[]{
	let hues = new Array(count).fill(0).map((hue,index) => index*(360/count));
	return hues;
}

//shiftEveryNth([1,2,3,4,5,6,7,8,9,10], 2) becomes [1,3,5,7,9,2,4,6,8,10]
//shiftEveryNth([1,2,3,4,5,6,7,8,9,10], 3) becomes [1,4,7,10,2,5,8,3,6,9]
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

//Class representing an HSL color
class HSL{
	public constructor(
		public hue:number,
		public saturation:number,
		public lightness:number
	){}
	
	//Returns this color as hsl(h,s,l) string
	public toString():string{
		return `hsl(${this.hue},${this.saturation}%,${this.lightness}%)`;
	}
}

//Class representing an RGB color
class RGB{
	public constructor(
		public red:number,
		public green:number,
		public blue:number
	){}
	
	//Returns this color as rgb(r,g,b) string
	public toString():string{
		return `rgb(${this.red},${this.green},${this.blue})`;
	}
}

//A palette is a list of HSL or RGB colors
abstract class Palette{
	protected colors:(HSL|RGB)[];
	protected loop:boolean;
	
	public constructor(loop?:boolean){
		this.loop = loop==null?true:loop;
	}
	
	//Returns all colors in this palette
	public getColors():(HSL|RGB)[]{
		return this.colors;
	}
	
	//When loop is off, index must be smaller than colors.length
	public colorAt(index:number):(HSL|RGB){
		return this.loop?this.colors[index%this.colors.length]:this.colors[index];
	}
	
	//Rotate the color palette
	public rotate(amount?:number):void{
		if(!amount)
			amount = Math.floor(Math.random()*this.colors.length)
		this.colors = rotate(this.colors,amount);
	}
	
	//Shifts values within the palette apart from each other
	public shift(amount?:number):void{
		if(!amount)
			amount = Math.round(this.colors.length**.5)+1
		this.colors = shiftParts(this.colors,amount);
	}
	
	//Reverses the order of colors in the palete
	public reverse(){
		this.colors.reverse();
	}
	
	//Randomizes the order of the palette
	public randomize(){
		shuffleArray(this.colors);
	}
}

//A completely random color is given every time colorAt() is used
export class RandomPalette extends Palette{
	public constructor(){
		super(false);
		this.colors = [];
	}
	public colorAt(index?:number):HSL{
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
		super(howManyColors,100,80,loop);
	}
}

//Dark colors
export class DarkPalette extends HuePalette{
	public constructor(howManyColors:number,loop?:boolean){
		super(howManyColors,100,20,loop);
	}
}

//Colors with saturation and lightness at 50%
export class PlainPalette extends HuePalette{
	public constructor(howManyColors:number,loop?:boolean){
		super(howManyColors,50,50,loop);
	}
}

//Bright colors
export class BrightPalette extends HuePalette{
	public constructor(howManyColors:number,loop?:boolean){
		super(howManyColors,100,50,loop);
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
