"use strict"
const R = require("ramda");

console.log("SOLUTION1: "+solution1());
console.log("SOLUTION2: "+solution2());

function solution1(){
  return minimumDistance(allCities());
}

function solution2(){
  return maximumDistance(allCities());
}

function minimumDistance(cities){
  return R.reduce(R.min,Number.MAX_VALUE,R.map(measurePath,permute(cities)));
}

function maximumDistance(cities){
  return R.reduce(R.max,0,R.map(measurePath,permute(cities)));
}

function measurePath(path,acc) {
  let accumulator = acc || 0;
  if(path.length===2){
    return accumulator + distance(path[0],path[1]);
  }else{
    return measurePath( R.remove(0,1,path), accumulator + distance(path[0],path[1]) );
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

function distance(x,y){
  const distances = {"Faerun to Tristram" : 65,"Faerun to Tambi" : 129,"Faerun to Norrath" : 144,"Faerun to Snowdin" : 71,"Faerun to Straylight" : 137,"Faerun to AlphaCentauri" : 3,"Faerun to Arbre" : 149,"Tristram to Tambi" : 63,"Tristram to Norrath" : 4,"Tristram to Snowdin" : 105,"Tristram to Straylight" : 125,"Tristram to AlphaCentauri" : 55,"Tristram to Arbre" : 14,"Tambi to Norrath" : 68,"Tambi to Snowdin" : 52,"Tambi to Straylight" : 65,"Tambi to AlphaCentauri" : 22,"Tambi to Arbre" : 143,"Norrath to Snowdin" : 8,"Norrath to Straylight" : 23,"Norrath to AlphaCentauri" : 136,"Norrath to Arbre" : 115,"Snowdin to Straylight" : 101,"Snowdin to AlphaCentauri" : 84,"Snowdin to Arbre" : 96,"Straylight to AlphaCentauri" : 107,"Straylight to Arbre" : 14,"AlphaCentauri to Arbre" : 46};
  return distances[`${x} to ${y}`] || distances[`${y} to ${x}`];
}

function allCities(){return ["Faerun","Tristram","Tambi","Norrath","Snowdin","Straylight","AlphaCentauri","Arbre"];}
