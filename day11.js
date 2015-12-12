"use strict"
const R = require("ramda");

console.log("SOLUTION1: "+solution1());
console.log("SOLUTION2: "+solution2());

function solution1(){
  return nextCorrectPassword(getInput1());
}

function solution2(){
  return nextCorrectPassword(nextPsw(getInput2()));
}

function nextCorrectPassword(pw){
  while (!isCorrectPsw(pw)) {
    pw = nextPsw(pw);
  }
  return pw;
}

function isCorrectPsw (pw){
  return  !hasForbidden(pw) && hasTwiceDiffPair(pw) && hasThreeStraight(pw);
}

function hasForbidden(text){
  return /[iol]/.test(text);
}

function hasTwiceDiffPair (text){
  return /(.)\1.*(?!\1\1)(?=(.)\2)/.test(text);
}

function hasThreeStraight (text){
  return /abc|bcd|cde|def|efg|fgh|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz/.test(text);
}

function nextPsw(pw){
  const last = pw[pw.length-1];
  const next = nextLetter(last);
  if(next!=="a"){
    return pw.substr(0,pw.length-1) + next;
  }else{
    return nextPsw(pw.substr(0,pw.length-1)) + next;
  }
}

function nextLetter(n){
  return abcdefgh()[(find(n)+1)%26];
}

function find(c){
  return abcdefgh().indexOf(c);
}

function abcdefgh(){
  return "abcdefghijklmnopqrstuvwxyz";
}

function getInput1(){
  return "cqjxjnds";
}

function getInput2(){
  return "cqjxxyzz";
}
