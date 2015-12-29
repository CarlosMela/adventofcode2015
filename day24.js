"use strict"
const R = require("ramda");
var fs = require('fs');

var readableStream = fs.createReadStream('input24.txt');
let data = '';

readableStream.on('data', function(chunk) {
    data+=chunk;
});

readableStream.on('end', function() {
  let input = R.split('\r\n',data)
  .filter(x => x).map(x=>parseInt(x));


  console.log("SOLUTION1: "+solution1(input));
  console.log("SOLUTION2: "+solution2(input));
});

function solution1(input){
	const targetWeight = R.reduce(R.add,0,input)/3;
	let minNumber = Number.MAX_SAFE_INTEGER;
	let minQE = Number.MAX_SAFE_INTEGER;
	for (var i = 0; i < 10000000; i++) {
		let groups = divideInThree(input.slice(),targetWeight);
		if(isBalanced(groups)){
			let smaller = R.reduce((x,y)=>y.length<x.length?y:x,input,groups);
			minNumber = Math.min(minNumber,smaller.length);
			if(smaller.length === minNumber){
				minQE = Math.min(minQE,getQE(smaller));
			}
		}
	}

  return minQE;
}

function solution2(input){
	const targetWeight = R.reduce(R.add,0,input)/4;
	let minNumber = Number.MAX_SAFE_INTEGER;
	let minQE = Number.MAX_SAFE_INTEGER;
	for (var i = 0; i < 10000000; i++) {
		let groups = divideInFour(input.slice(),targetWeight);
		if(isBalancedFour(groups)){
			let smaller = R.reduce((x,y)=>y.length<x.length?y:x,input,groups);
			minNumber = Math.min(minNumber,smaller.length);
			if(smaller.length === minNumber){
				minQE = Math.min(minQE,getQE(smaller));
			}
		}
	}

  return minQE;
}

function getQE(a){
	return R.reduce((x,y)=>x*y,1,a);
}

function divideInThree(array,targetWeight){
		let a = shuffle(array);
		let b = [[],[],[]];
		let sums = [targetWeight,targetWeight,targetWeight];
		for(let i = 0;i<a.length;i++){
			for(let j =0;j<3;j++){
				if(sums[j]>0){
					sums[j] -= a[i];
					b[j].push(a[i]);
					break;
				}
			}
		}
		return b;
}

function divideInFour(array,targetWeight){
		let a = shuffle(array);
		let b = [[],[],[],[]];
		let sums = [targetWeight,targetWeight,targetWeight,targetWeight];
		for(let i = 0;i<a.length;i++){
			for(let j =0;j<4;j++){
				if(sums[j]>0){
					sums[j] -= a[i];
					b[j].push(a[i]);
					break;
				}
			}
		}
		return b;
}

function isBalanced(a){
	return weight(a[0])===weight(a[1]) && weight(a[0])===weight(a[2]) && weight(a[1])===weight(a[2]);
}

function isBalancedFour(a){
	return weight(a[0])===weight(a[1]) && weight(a[0])===weight(a[2]) && weight(a[0])===weight(a[3])
	 && weight(a[1])===weight(a[2]) && weight(a[1])===weight(a[3]) && weight(a[2])===weight(a[3]);
}

function weight(a){
	return R.reduce(R.add,0,a);
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}
