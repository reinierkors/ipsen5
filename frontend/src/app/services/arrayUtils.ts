//Randomizes the array order
export function shuffle<T>(array:T[]):T[]{
	for (let i=array.length-1;i>0;i--){
		let j = Math.floor(Math.random()*(i+1));
		let temp = array[i];
		array[i] = array[j];
		array[j] = temp;
	}
	return array;
}

//Rotates array values
//rotate([1,2,3,4,5],1) becomes [2,3,4,5,1]
//rotate([1,2,3,4,5],2) becomes [3,4,5,1,2]
export function rotate<T>(array:T[],rotateBy:number):T[]{
	return [...array.slice(rotateBy),...array.slice(0,rotateBy)];
}

//rotateParts([1,2,3,4,5,6,7,8,9,10], 2) becomes [1,3,5,7,9,2,4,6,8,10]
//rotateParts([1,2,3,4,5,6,7,8,9,10], 3) becomes [1,4,7,10,2,5,8,3,6,9]
export function rotateParts<T>(array:T[],shift:number):T[]{
	let shiftedValues = [];
	for(let i=0,count=array.length,take=0,takeStart=0;i<count;++i){
		shiftedValues.push(array[take]);
		take += shift;
		if(take>=count){
			++takeStart;
			take = takeStart;
		}
	}
	return shiftedValues;
}

//Remove duplicates from an array
//[1,2,1,2,3].filter(uniqueFilter) becomes [1,2,3]
export function uniqueFilter(value,index,self){
	return self.indexOf(value)===index;
}
