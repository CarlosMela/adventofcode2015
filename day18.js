"use strict"
const R = require("ramda");
var fs = require('fs');

var readableStream = fs.createReadStream('input18.txt');
let data = '';

readableStream.on('data', function(chunk) {
    data+=chunk;
});

readableStream.on('end', function() {
  let grid = R.split('\r\n',data)
  .filter(x => x).map(x => x.split('').filter(y => y))
  .map(x=>x.map(y=>y==='#'?1:0));

  console.log(solution1(grid,100));
  console.log(solution2(grid,100));
});

function solution1(grid,times){
  for(let time = 0; time<times; time++){
    let newGrid = getGrid(grid.length,0);
    for(let i=0;i<grid.length;i++){
      for(let j=0;j<grid[0].length;j++){
        newGrid[i][j] = switchLigth(grid,{x:i,y:j});
      }
    }
    grid = newGrid;
  }
  return countOn(grid);
}

function switchOnCorners(grid){
  grid[0][0]=1;
  grid[0][grid.length-1]=1;
  grid[grid.length-1][0]=1;
  grid[grid.length-1][grid.length-1]=1;
  return grid;
}

function solution2(grid,times){
  grid = switchOnCorners(grid);
  for(let time = 0; time<times; time++){
    let newGrid = getGrid(grid.length,0);
    for(let i=0;i<grid.length;i++){
      for(let j=0;j<grid[0].length;j++){
        newGrid[i][j] = switchLigth(grid,{x:i,y:j});
      }
    }
    newGrid = switchOnCorners(newGrid);
    grid = newGrid;
  }
  return countOn(grid);
}

function switchLigth (grid,light) {
  const l = R.curry(getLight)(grid);

  const on = l(light);
  const around = getAdjacents(grid,light);
  const nOn = R.reduce((x,y)=>x+l(y),0,around);
  let newState = 0;

  if( (on && (nOn===2 || nOn===3)) || (!on && nOn===3)){
    newState = 1;
  }
  return newState;
}

function countOn(grid){
  return R.reduce((x,y)=>x+R.reduce((i,j)=>i+j,0,y),0,grid);
}

function getAdjacents(grid,light){
  let list = [];
  const xmax = grid.length;
  const ymax = grid[0].length;
  for(let i = R.max(light.x-1,0);i<=light.x+1 && i<xmax;i++){
    for(let j = R.max(light.y-1,0);j<=light.y+1 && j<ymax;j++){
      if(i!==light.x || j!==light.y){
        list.push({x:i,y:j});
      }
    }
  }
  return list;
}

function getLight(grid,light){
  return grid[light['x']][light['y']];
}

function getGrid(size,value){
  var grid = [];
  for(var i=0;i<size;i++){
    var row = new Array(size);
    grid.push(row.fill(value,0,size));
  }
  return grid;
}
