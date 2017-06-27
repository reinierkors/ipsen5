import {Color,RGB,HSL} from './color';
import {shuffle,rotate,rotateParts} from './arrayUtils';

//A palette is a list of HSL or RGB colors
export abstract class Palette{
	private originalColors:Color[];
	private currentColors:Color[];
	
	public set colors(colors:Color[]){
		this.originalColors = colors;
		this.currentColors = colors;
	}
	public get colors():Color[]{
		return this.currentColors;
	}
	
	public loop:boolean;
	
	public constructor(loop?:boolean){
		this.loop = loop==null?true:loop;
	}
	
	//Reset color array to before any transformations
	public reset():void{
		this.currentColors = [...this.originalColors];
	}
	
	//Make copy of palette
	public clone(){
		let cloneObj = Object.create(this);
		cloneObj.originalColors = this.originalColors.map(color => color.asHSL());
		cloneObj.currentColors = this.currentColors.map(color => color.asHSL());
		return cloneObj;
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
		this.colors = rotateParts(this.colors,amount);
		return this;
	}
	
	//Reverses the order of colors in the palete
	public reverse():Palette{
		this.colors.reverse();
		return this;
	}
	
	//Randomizes the order of the palette
	public randomize():Palette{
		shuffle(this.colors);
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
		let hues = new Array(howManyColors).fill(0).map((v,index) => 1/howManyColors*index);
		this.colors = hues.map(hue => new HSL(hue,saturation,lightness));
	}
}

//A palette with different saturations, but the hue and lightness are set in the constructor
export class SaturationPalette extends Palette{
	public constructor(howManyColors:number,hue:number,lightness:number,loop?:boolean){
		super(loop);
		let saturations = new Array(howManyColors).fill(0).map((v,index) => 1/howManyColors*index);
		this.colors = saturations.map(saturation => new HSL(hue,saturation,lightness));
	}
}

//A palette with different lightnesses, but the hue and saturation are set in the constructor
export class LightnessPalette extends Palette{
	public constructor(howManyColors:number,hue:number,saturation:number,loop?:boolean){
		super(loop);
		let lightnesses = new Array(howManyColors).fill(0).map((v,index) => 1/howManyColors*index);
		this.colors = lightnesses.map(lightness => new HSL(hue,saturation,lightness));
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
