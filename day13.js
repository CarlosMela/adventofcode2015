"use strict"
const R = require("ramda");

var fs = require('fs');
var readableStream = fs.createReadStream('input13.txt');

let happyChart;
let data = '';

readableStream.on('data', function(chunk) {
    data+=chunk;
});

readableStream.on('end', function() {
    happyChart = R.split('\r\n',data)
    .filter(x => x)
    .reduce((previousValue, currentValue, currentIndex, array)=>{
      let values = R.match(/(\w+) would (\w+) (\d+) happiness units by sitting next to (\w+)./,currentValue);
      // console.log(values);
      previousValue[`${values[1]} to ${values[4]}`]=parseInt(values[3])*(values[2]==='gain'?1:-1);
      return previousValue;
    }
    ,{});

    console.log("SOLUTION1: "+solution1());
    console.log("SOLUTION2: "+solution2());
});

function solution1(){
  return maximumHappiness(allPeople());
}

function solution2(){
  return maximumHappiness(R.append("Carlos",allPeople()));
}

function maximumHappiness(people){
  return R.reduce(R.max,0,R.map(R.compose(measureHappiness,R.prepend(people[0]),R.append(people[0])),permute(R.remove(0,1,people))));
}

function measureHappiness(path,acc) {
  let accumulator = acc || 0;
  if(path.length===2){
    return accumulator + getHappiness(path[0],path[1]);
  }else{
    return measureHappiness( R.remove(0,1,path), accumulator + getHappiness(path[0],path[1]) );
  }
};

function permute(array,p){//p=permutations
  let permutations = p || [[]];
  const combine = R.curry(combineElement);
  if(array.length===1){
    return R.chain(combine(array[0]),permutations);
  }else{
    return permute(R.remove(0,1,array),R.chain(combine(array[0]),permutations));
  }
}

function combineElement(x,p){//x=element,p=permutation
  let combinations = [];
  for(let i=0; i<=p.length ; i++){
    combinations.push(R.insert(i,x,p));
  }
  return combinations;
}


function getHappiness(x,y){
  if(x==="Carlos" || y==="Carlos"){
    return 0;
  }
  return happyChart[`${x} to ${y}`] + happyChart[`${y} to ${x}`];
}

function allPeople(){return ["Alice","Bob","Carol","David","Eric","Frank","George","Mallory"];}
