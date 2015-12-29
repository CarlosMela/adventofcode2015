(function() {
	"use strict"
	const R = require("ramda");
	var fs = require('fs');

	//goval variables
	let global_turns = [0,0,0];
	let global_totalSpend = 0;
	let global_increaseArmor = 0;

	var readableStream = fs.createReadStream('input22.txt');
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

	function solution1(input){//101 too low,solution 900
		let boss = JSON.parse(`{${input.join(',')}}`);
		// let boss = {HitPoints:13,Damage:8};
		// let boss = {HitPoints:51,Damage:9};
		let gold = 10000000;
			for (var i = 0; i < 10000; i++) {
			let me = Object.assign({HitPoints:50},{Damage:0,Armor:0,Mana:500});
			let spend = playGame(me,Object.assign({},boss));
			if(spend){
				gold = Math.min(gold,spend);
			}
		}
		return gold;
	}

	function solution2(input){//101 too low,solution 900
		let boss = JSON.parse(`{${input.join(',')}}`);
		let gold = 10000000;
			for (var i = 0; i < 50000; i++) {
			 let me = Object.assign({HitPoints:50},{Damage:0,Armor:0,Mana:500});
			let spend = playGame(me,Object.assign({},boss),true);
			if(spend){
				gold = Math.min(gold,spend);
			}
		}
		return gold;
	}


	function getRandomSpells(player,isBossTurn){
		let SpellsToCast = [];
		let Spells=[ {Cost:53,Damage:4,Armor:0,Turns:0,Mana:0,HitPoints:0}, {Cost:73,Damage:2,Armor:0,Turns:0,Mana:0,HitPoints:2}	];

		if (global_turns[0]) {
			global_turns[0]--;
		}
		if(!global_turns[0]){
			Spells.push({Cost:113,Damage:0,Armor:7,Turns:6,Mana:0,HitPoints:0});
		}else{
			SpellsToCast.push({Cost:113,Damage:0,Armor:7,Turns:6,Mana:0,HitPoints:0});
		}

		if (global_turns[1]) {
			global_turns[1]--;
		}
		if(!global_turns[1]){
			Spells.push({Cost:173,Damage:3,Armor:0,Turns:6,Mana:0,HitPoints:0});
		}else{
			SpellsToCast.push({Cost:173,Damage:3,Armor:0,Turns:6,Mana:0,HitPoints:0});
		}

		if (global_turns[2]) {
			global_turns[2]--;
		}
		if(!global_turns[2]){
			Spells.push({Cost:229,Damage:0,Armor:0,Turns:5,Mana:101,HitPoints:0});
		}else{
			SpellsToCast.push({Cost:229,Damage:0,Armor:0,Turns:5,Mana:101,HitPoints:0});
		}

		if(!isBossTurn){
			Spells = R.filter(x=>x.Cost <= player.Mana,Spells);

			if(Spells.length===0){//if not enought money losses
				return false;
			}

			const obj = Object.assign({},Spells[getRandomInt(0,Spells.length-1)]);
			global_totalSpend += obj.Cost;
			player.Mana -= obj.Cost;
			if(obj.Cost===113){
				global_turns[0]=obj.Turns;
			}else if (obj.Cost===173) {
				global_turns[1]=obj.Turns;
			}else if (obj.Cost===229) {
				global_turns[2]=obj.Turns;
			}

			SpellsToCast.push(obj)
		}

		return SpellsToCast;
	}

	function hit(p1,p2){//payer1 hits player2
		const d = p1.Damage-global_increaseArmor;
		return Object.assign({},p2,{HitPoints: p2.HitPoints - Math.max(d,1) });
	}

	function playGame(player,boss,hard){
		global_turns = [0,0,0];
		global_totalSpend = 0;
		while (true) {
			if(hard){
				player.HitPoints--;
				//posssible end point
				if(player.HitPoints<=0){
					return false;
				}
			}

			let spells1 =  getRandomSpells(player);

			//posssible end point
			if(!spells1){
				return false;
			}

			for(let i in spells1){
					player = spellOnMe(player,spells1[i]);
					boss = spellOnBoss(boss,spells1[i]);
			}

			//posssible end point
			if(boss.HitPoints<=0){
				return global_totalSpend;
			}

			global_increaseArmor = 0;//only afect when player is hit
			let spells2 =  getRandomSpells(player,true);
			for(let i in spells2){
					player = spellOnMe(player,spells2[i]);
					boss = spellOnBoss(boss,spells2[i]);
			}

			//posssible end point
			if(boss.HitPoints<=0){
				return global_totalSpend;
			}

			player = hit(boss,player);

			//posssible end point
			if(player.HitPoints<=0){
				return false;
			}
		}
	}

	function spellOnMe(me,spell){
		me.HitPoints += spell.HitPoints;
		me.Mana += spell.Mana;
		if(spell.Armor){
			global_increaseArmor = spell.Armor;
		}
		return me;
	}

	function spellOnBoss(boss,spell){
		boss.HitPoints -= spell.Damage;
		return boss;
	}

	/**
	* Returns a random integer between min (inclusive) and max (inclusive).
	*/
	function getRandomInt(min, max) {
	    return Math.floor(Math.random() * (max - min + 1)) + min;
	}
})();
