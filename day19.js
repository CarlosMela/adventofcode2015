"use strict"
const R = require("ramda");
var fs = require('fs');

var readableStream = fs.createReadStream('input19.txt');
let data = '';

readableStream.on('data', function(chunk) {
    data+=chunk;
});

readableStream.on('end', function() {
  let input = R.split('\r\n',data)
  .filter(x => x);

  const replacements = R.take(input.length-1,input);
  const molecule = R.last(input);
  // const replacements = ["e => H",
  //                       "e => O",
  //                       "H => HO",
  //                       "H => OH",
  //                       "O => HH"];
  // const molecule = "HOH";
  // const molecule = "HOHOHO";

  console.log(solution1(molecule,replacements));
  console.log(solution2(molecule,replacements));
});

function solution1(molecule,replacements){
  let allCreated = [];
  for(let i in replacements){
    allCreated = R.concat(allCreated,replace(molecule,replacements[i]));
  }
  return R.uniq(allCreated).length;
}

function exponentialSolution2(molecule,replacements){
  const initialMolecule = 'e';
  let allCreated = [initialMolecule];
  let counter = 0;
  while (true) {
    counter++;
    let newList =[];
    for(let i in replacements){
      for(let j in allCreated){
        let newMol = R.uniq(replace(allCreated[j],replacements[i]));
        if(R.contains(molecule,newMol)){
          return counter;
        }
        newList = R.uniq(R.concat(newList,newMol));
      }
    }
    allCreated = newList;
  }
}

function solution2(molecule,replacements){
  replacements = R.map(rep=>{
    const find = rep.split(' => ')[0];
    const put = rep.split(' => ')[1];
    return {"in":find,"out":put};
  },replacements);

  let steps = 0;
  while (true) {
    steps = findE(molecule,replacements);
    if(steps){
      return steps;
    }
    replacements = shuffle(replacements);
  }
}

function findE(molecule,replacements,left,steps){
  steps = steps || 0;
  if(typeof left === "undefined"){
    left = replacements;
  }
  //end case
  if(molecule==='e'){
    return steps;
  }

  for(let i in left){
    let regex = new RegExp(left[i].out);
    if(R.test(regex,molecule)){
      //next iteration
      steps++;
      const newMolecule = R.replace(regex,left[i].in,molecule);
      return findE(newMolecule,replacements,replacements,steps);
    }
  }
  if(left.length>0){
    return findE(molecule,replacements,R.takeLast(left.length-1,left),steps);
  }
  return 0;
}

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function replace(molecule,rep){
  const find = rep.split(' => ')[0];
  const put = rep.split(' => ')[1];
  let created =[];
  const splited = R.split(find,molecule);

  for(let i = 0; i<splited.length-1; i++){
    let newMol = R.join(find,R.take(i+1,splited)) + put + R.join(find,R.takeLast(splited.length-i-1,splited));
    created.push(newMol);
  }

  return created;
}
