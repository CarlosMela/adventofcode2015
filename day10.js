"use strict"
const R = require("ramda");

console.log("SOLUTION1: "+solution1());
console.log("SOLUTION2: "+solution2());

function solution1(){
  return translateNTimes("1113122113",40);
}

function solution2(){
  return translateNTimes("1113122113",50);
}

function translateNTimes(number,times){
  let tranlation = number;
  for(let i = 0; i<times; i++){
    tranlation = translate(tranlation);
  }
  return tranlation.length;
}

function translate(n){
  const arrayOfSpeparatedNumbers = R.match(/(\d{1})\1*/g,n);
  return R.map(count,arrayOfSpeparatedNumbers).reduce(R.concat);
}

function count(n){
  return  n ? n.length + n[0] : "";
}
