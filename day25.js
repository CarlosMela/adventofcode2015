"use strict"

console.log("SOLUTION1: "+JSON.stringify(solution1()));

function solution1(){
	let start = {x:1,y:1,val:20151125};
	while (start.x!==2981 || start.y!==3075) {
		start = nextValue(start);
	}
  return start;
}

function nextValue(prev){
	let x = prev.x;
	let y = prev.y;
	if(x===1){
		x=y+1;
		y=1;
	}else {
		x-=1;
		y+=1;
	}
	return {x:x,y:y,val:(prev.val*252533)%33554393};
}
