"use strict"
const R = require("ramda");
const names = ["Sprinkles","Butterscotch","Chocolate","Candy"];
const ingredients = {Sprinkles: {capacity: 2, durability: 0, flavor: -2, texture: 0, calories: 3},
Butterscotch: {capacity: 0, durability: 5, flavor: -3, texture :0, calories :3},
Chocolate: {capacity: 0, durability: 0, flavor: 5, texture: -1, calories: 8},
Candy: {capacity: 0, durability: -1, flavor: 0, texture: 5, calories: 8}};

function getIngredient(i){
  return ingredients[names[i]];
}

console.log("SOLUTION1: "+solution1());
console.log("SOLUTION2: "+solution2());

function solution1(){
  return R.reduce(R.max,0,getSimpleDistributions(100).map(score));
}

function solution2(){
  return R.reduce(R.max,0,getSimpleDistributions(100).map(score500));
}

function score(recipe) {
  return recipe.map((val,i,arr)=>R.mapObjIndexed((w, key, obj) => key==="calories"?0:val*w,getIngredient(i)))
  .map((val,i,arr)=>objToArray(val)).reduce((previousValue, currentValue, currentIndex, array)=>{
    for(var t = 0; t<previousValue.length; t++){
      previousValue[t]+=currentValue[t];
    }
    return previousValue;
  },[0,0,0,0]).reduce((x,y)=>y<=0?0:x*y,1);
};

function score500(recipe) {
  var sum = recipe.map((val,i,arr)=>R.mapObjIndexed((w, key, obj) => val*w,getIngredient(i)))
  .map((val,i,arr)=>objToArray(val)).reduce((previousValue, currentValue, currentIndex, array)=>{
    for(var t = 0; t<previousValue.length; t++){
      previousValue[t]+=currentValue[t];
    }
    return previousValue;
  },[0,0,0,0,0]);
  if(sum[4]===500){
    return sum.slice(0,4).reduce((x,y)=>(y<=0?0:x*y),1);
  }else{
    return 0
  }
};

function getSimpleDistributions(total){
  let dist = [];
  for(var i = 0; i<=total; i++){
    for(var j = 0; j<=total-i; j++){
      for(var k= 0; k<=total-i-j; k++){
        for(var l= 0; l<=total-i-j-k; l++){
          if(i+j+k+l===100){
            dist.push([i,j,k,l]);
          }
        }
      }
    }
  }
  return dist;
}

/**
 * Create a array with all the values of the object attributes
 */
function objToArray(obj){
  var arr = [];
      for (var key in obj) {
        arr.push(obj[key]);
      }
      return arr;
}
