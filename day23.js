"use strict"
const R = require("ramda");
var fs = require('fs');

var readableStream = fs.createReadStream('input23.txt');
let data = '';

readableStream.on('data', function(chunk) {
    data+=chunk;
});

readableStream.on('end', function() {
  let input = R.split('\r\n',data)
  .filter(x => x);

  console.log("SOLUTION1: "+solution1(input));
  console.log("SOLUTION2: "+solution2(input));
});

function solution1(input){
	return JSON.stringify(execute(input,0,{a:0,b:0}));
}

function solution2(input){
  return JSON.stringify(execute(input,0,{a:1,b:0}));
}

function execute(instructions,number,registers){
	if(number >= instructions.length){
		return registers;
	}else {
		let parsed = parse(instructions,number,registers);
		return execute(instructions,parsed.next,parsed.registers);
	}

}

function parse(instructions,number,registers){
	let instruction = instructions[number];
	let next = number+1;

	let values = R.match(/(hlf|tpl|inc) (a|b)/,instruction);
	if(values.length){
		let reg = values[2];
		let inst = values[1];
		switch (inst) {
			case "inc":
				registers[reg]+=1;
				break;
			case "tpl":
				registers[reg]*=3;
				break;
			case "hlf":
				registers[reg]/=2;
				break;
		}
	}else{

		values = R.match(/jmp ([+-]\d+)/,instruction);
		if(values.length){
			let forNext = parseInt(values[1]);
			next = number + forNext;
		}else {
			values = R.match(/(jie|jio) (a|b), ([+-]\d+)/,instruction);
			if(values.length){
				let jmp = parseInt(values[3]);
				let reg = values[2];
				let inst = values[1];
				switch (inst) {
					case "jie":
					if(registers[reg]%2===0){
						next = number + jmp;
					}
					break;
					case "jio":
					if(registers[reg]===1){
						next = number + jmp;
					}
					break;
				}
			}
		}
	}

	return {next:next,registers:registers};
}
