"use strict"
const R = require("ramda");

var fs = require('fs');
var readableStream = fs.createReadStream('input17.txt');

let containers;
let data = '';

readableStream.on('data', function(chunk) {
    data+=chunk;
});

readableStream.on('end', function() {
  containers = R.split('\r\n',data)
  .filter(x => x).map(x => parseInt(x))
  .sort((x,y)=>y>=x?1:-1);

  var combinationsWithRepetitions = [];
  for(var i =0;i<containers.length;i++){
    combinationsWithRepetitions = R.concat(combinationsWithRepetitions,combine(150,R.takeLast(containers.length -i,containers)));
  }
  var foundCombinations = [];
  var simpler = combinationsWithRepetitions.filter(ar => {
      var index = foundCombinations.findIndex(x => JSON.stringify(ar)===JSON.stringify(x));
      var existing = index>-1;
      if(!existing){
        foundCombinations.push(ar);
        return true;
      }else{
        return false;
      }
  });

  var minimumContiners = minimumContinersFn(simpler);
  console.log("SOLUTION1: ",simpler.length);
  console.log("SOLUTION2: " + simpler.filter(x => countNotEmpty(x)===minimumContiners).length);
});

function minimumContinersFn(allCombinations){
  return R.reduce(R.min,Number.MAX_VALUE,R.map(countNotEmpty,allCombinations));
}

function countNotEmpty(array){
  return R.reduce((x,y)=>(y?x+1:x),0,array);
}

function combine(amount, containersLeft,combinations,comb,sum){
  combinations = combinations || [];
  comb = comb || new Array(containers.length+1).join('0').split('').map(parseFloat);
  sum = sum || 0;
  if(sum===amount){
    var index = combinations.findIndex(x => JSON.stringify(x)===JSON.stringify(comb));
      return R.append(comb,combinations);
  }else if(containersLeft.length===0 || sum>amount){
    return combinations;
  }else{
    const size = containersLeft[0];
    var newComb = comb.slice();
    newComb[containers.length - containersLeft.length]=size;
    for(var i = 1; i<=containersLeft.length;i++){
      combinations = R.concat(combinations,combine(amount,R.takeLast(containersLeft.length-i,containersLeft),[],newComb,sum+size));
    }
    return combinations;
  }
}
