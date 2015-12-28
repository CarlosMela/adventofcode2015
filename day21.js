"use strict"
const R = require("ramda");
var fs = require('fs');

var readableStream = fs.createReadStream('input21.txt');
let data = '';

readableStream.on('data', function(chunk) {
    data+=chunk;
});

readableStream.on('end', function() {
  let input = R.split('\r\n',data)
  .filter(x => x)
	.map(R.replace(/ /g,x=>''))
  .map(R.replace(/(.+):/,(x,y)=>`\"${y}\":`));

  console.log("SOLUTION1: "+solution1(input));
  console.log("SOLUTION2: "+solution2(input));
});

function solution1(input){
	let boss = JSON.parse(`{${input.join(',')}}`);
	let gold = 10000000;
	for (var i = 0; i < 100000; i++) {
		let me = Object.assign({HitPoints:100},getRandomItems());
		if(playGame(me,boss)){
			gold = Math.min(gold,me.Cost);
		}
	}
	return gold;
}

function solution2(input){
	let boss = JSON.parse(`{${input.join(',')}}`);
	let gold = 0;
	for (var i = 0; i < 100000; i++) {
		let me = Object.assign({HitPoints:100},getRandomItems());
		if(!playGame(me,boss)){
			gold = Math.max(gold,me.Cost);
		}
	}
	return gold;
}

function getRandomItems(){
	const noItem = {Cost:0,Damage:0,Armor:0};
	const Weapons=[{Cost:8, Damage:4, Armor:0},{Cost:10, Damage:5, Armor:0},{Cost:25, Damage:6, Armor:0},
	{Cost:40, Damage:7, Armor:0},{Cost:74, Damage:8, Armor:0}];
	const Armor=[{Cost:13, Damage:0, Armor:1},{Cost:31, Damage:0, Armor:2},{Cost:53, Damage:0, Armor:3},
	{Cost:75, Damage:0, Armor:4},{Cost:102, Damage:0, Armor:5}];
	const Rings=[{Cost:25, Damage:1, Armor:0},{Cost:50, Damage:2, Armor:0},{Cost:100, Damage:3, Armor:0},
	{Cost:20, Damage:0, Armor:1},{Cost:40, Damage:0, Armor:2},{Cost:80, Damage:0, Armor:3}];

	const int1 = getRandomInt(0,6);
	const ring1 = Rings[int1]||noItem;
	let ring2 = noItem;
	if(int1<6){
		const int2 = getRandomInt(0,5);
		const array2 = Rings.splice(0,int1).concat(Rings.slice(int1+1));
		ring2 = array2[int2]||noItem;
	}else{
		const int2 = getRandomInt(0,6);
		ring2 = Rings[int2]||noItem;
	}

	let values = [
		Weapons[getRandomInt(0,4)],
		Armor[getRandomInt(0,5)]||noItem,
		ring1,
		ring2
	];

	let sum = (acc,obj) => {
		return {Cost: acc.Cost+obj.Cost,
		Damage:acc.Damage+obj.Damage,
		Armor:acc.Armor+obj.Armor};
	};

	return R.reduce(sum,noItem, values);
}

function hit(p1,p2){//payer1 hits player2
	const d = p1.Damage -p2.Armor;
	return Object.assign({},p2,{HitPoints: p2.HitPoints - Math.max(d,1) });
}

function playGame(player,boss){
	while (true) {
		boss = hit(player,boss);
		if(boss.HitPoints<=0){
			return true;
		}
		player = hit(boss,player);
		if(player.HitPoints<=0){
			return false;
		}
	}
}

/**
* Returns a random integer between min (inclusive) and max (inclusive).
*/
function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
