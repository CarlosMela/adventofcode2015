"use strict"
const R = require("ramda");

var savedDivisors = [];//cache
function getDivisors(number,start,divisors){
  divisors = divisors || [1];
  if(savedDivisors[number]){
    return savedDivisors[number];
  }
  start = start || 2;
  while (start <=number/2) {
    if (number%start===0) {
      divisors = R.append(start,divisors);
      // number = number/start; //this would give the prime factorization
      start = start+1;
    }else{
      start = start+1;
    }
  }
  savedDivisors[number]=R.append(number,divisors);
  return savedDivisors[number];
}

function brutalSOLUTION1(number){
  let i = 800000;
  while (true) {
    if(calculatePresent(i)>=number){
      return i;
    }else{
      i++;
    }
  }
}

function SOLUTION2(number){
  let houses = [];
  for(let elf = 1; elf < number/11 ; elf++){
    let delivered = 0;
    for(let i = elf; i < number/11; i = i + elf){
      if(delivered<50){
        houses[i] = (houses[i] || 11) + 11*elf;
      }
      delivered++;
    }
  }
  return houses.reduce((previous,current,index) => previous===0 && current > number? index : previous,0);
}

function SOLUTION1(number){
  let houses = [];
  for(let elf = 1; elf < number/10 ; elf++){
    for(let i = elf; i < number/10; i = i + elf){
      houses[i] = (houses[i] || 10) + 10*elf;
    }
  }
  return houses.reduce((previous,current,index) => previous===0 && current > number? index : previous,0);
}

function calculatePresent(house){
  var divisors = getDivisors(house);
  return 10*R.reduce(R.add,0,divisors);
}


console.log(SOLUTION1(36000000));
// console.log(brutalSOLUTION1(36000000));
console.log(SOLUTION2(36000000));
// console.log(SOLUTION2(180));

/* Recursive version of prime factorization. Error too many recursive calls */
// function getDivisors(number,start,divisors){
//   divisors = divisors || [1];
//   start = start || 2;
//   if(start >number/2){
//       return R.append(number,divisors);
//   }else if (number%start===0) {
//     return getDivisors(number/start,start,R.append(start,divisors));
//   }else{
//     return getDivisors(number,start+1,divisors);
//   }
// }
