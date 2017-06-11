
export interface Color{
	asHSL():HSL;
	asRGB():RGB;
	toString():string;
}

//Class representing an HSL color
//H, S and L are in range 0.0 .. 1.0
export class HSL implements Color{
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
export class RGB implements Color{
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
