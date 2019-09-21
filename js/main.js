// fork from "https://github.com/nickarocho/minesweeper"
// Original code from nickarocho
// License Not Figured.
// Using Open-Source Game code 
// Analyze & Modify by KHW

/*----- constants -----*/
var bombImage = '<img src="images/bomb.png">';
var flagImage = '<img src="images/flag.png">';
var wrongBombImage = '<img src="images/wrong-bomb.png">'
var sizeLookup = {
  'EZ': {size:13, totalBombs:40, tableWidth: "338px"}, // 45.15%
  'NM': {size:20, totalBombs:70, tableWidth: "520px"}, // 18.70%
  'HD': {size:25, totalBombs:100, tableWidth: "650px"}, // 2.35%
};
var colors = [
  '',
  '#0000FA',
  '#4B802D',
  '#DB1300',
  '#202081',
  '#690400',
  '#457A7A',
  '#1B1B1B',
  '#7A7A7A',
];

/*----- app's state (variables) -----*/
// map var
const level = sessionStorage.getItem("level");
const colSize = sizeLookup[level].size;
const rowSize = 15;

const protect = document.getElementById("item_protect");
const predict = document.getElementById("item_predict");

var board;
var bombCount;
var gameSHA;

// bomb var
var winner;
var adjBombs;
var hitBomb;

// timer var - setTimer()
var timerId;
var elapsedTime;
var timeElapsed;


// touch timer var
var touchStartTimeStamp;
var touchEndTimeStamp
var touchFlag = [false, false];

// item user
var startCell = null;

/*----- cached element references -----*/
var boardEl = document.getElementById('board');


window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));
  }
});

boardEl.addEventListener('click', function(e) {
  if (winner || hitBomb) return;
  
  var clickedEl = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target; 

  if (clickedEl.classList.contains('game-cell')) {
    if (!timerId) {
      if(startCell !== null) {
        var td = document.querySelector(`[data-row="${startCell.row}"][data-col="${startCell.col}"]`);
        td.style.backgroundColor = "#C0C0C0";
      }
      setTimer(); 
    }
    var row = parseInt(clickedEl.dataset.row);
    var col = parseInt(clickedEl.dataset.col);
    var cell = board[row][col];

    if(cell.flagged) return;
     
    hitBomb = cell.reveal();
    
    if(sessionStorage.getItem("flag") === "true") {
      if(bombCount !== 0) {
        bombCount -= 1;
      }

      sessionStorage.removeItem("flag");
    }

    if (hitBomb) { 
      revealAll();
      clearInterval(timerId);
      
      e.target.style.backgroundColor = 'red';
    }
  } else if(clickedEl.classList.contains('revealed')){
      var row = parseInt(clickedEl.dataset.row);
      var col = parseInt(clickedEl.dataset.col);
      var cell = board[row][col];

      if(cell.calcAdjFlagsAndOpen()) {
        hitBomb = true;
        revealAll();
        clearInterval(timerId);
      }
    } 

    winner = getWinner();
    render();
});




boardEl.addEventListener('contextmenu',function(e){
  e.preventDefault();
  var clickedEl = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target;
  if(clickedEl.classList.contains('game-cell')) {
    if (!timerId) {
      if(startCell !== null) {
        var td = document.querySelector(`[data-row="${startCell.row}"][data-col="${startCell.col}"]`);
        td.style.backgroundColor = "#C0C0C0";
      }
      setTimer(); 
    }
    var row = parseInt(clickedEl.dataset.row);
    var col = parseInt(clickedEl.dataset.col);
    var cell = board[row][col];

    if(!cell.revealed && bombCount >= 0) {
      if(bombCount == 0 && !cell.flagged) {
      } else {
        bombCount += cell.flag() ? -1 : 1;
      }
    }
  }
  winner = getWinner();
  render();
});


document.getElementById('result-btn').addEventListener('click', function() {
  sessionStorage.clear();
  window.location.href='index.html';

});


function setTimer () {
  timerId = setInterval(function(){
    elapsedTime += 1;
    document.getElementById('timer').innerText = elapsedTime.toString().padStart(3, '0');
  }, 1000);
};

function revealAll() {
  board.forEach(function(rowArr) {
    rowArr.forEach(function(cell) {
      cell.reveal();
    });
  });
};


function unveil() {
  var revealNum = Math.floor(sizeLookup[sessionStorage.getItem("level")].size * rowSize / 5);
  var curVeilNum = 0;

  var tdList = Array.from(document.querySelectorAll('[data-row]'));

  tdList.some(function(td) {
    var rowIdx = parseInt(td.getAttribute('data-row'));
    var colIdx = parseInt(td.getAttribute('data-col'));
    var cell = board[rowIdx][colIdx]; 
    
    curVeilNum += 1;

    if (cell.isBomb) {
        td.innerHTML = bombImage;
    } else if (cell.adjBombs) {
        td.style.color = colors[cell.adjBombs];
        td.textContent = cell.adjBombs;
    }

    return curVeilNum == revealNum;
  });
};

function veil() { 
  var tdList = Array.from(document.querySelectorAll('[data-row]'));
  tdList.some(function(td) {
    td.innerHTML = "";
    td.textContent = "";
  });
}

function buildTable() {
  var topRow = `
  <tr>
    <td class="menu" id="window-title-bar" colspan="${colSize}">
      <div id="window-title"><img src="images/mine-menu-icon.png"> Minesweeper</div>
      <div id="window-controls"><img src="images/window-controls.png"></div>
    </td>
  <tr>
    <td class="menu" id="folder-bar" colspan="${colSize}">
      
      <div id="folder2"><a href="https://github.com/Kwon1992/kwon1992.github.io/tree/master/minesweeper" target="blank">Source Code</a></div>
    </td>
  </tr>
  </tr>
    <tr>
      <td class="menu" colspan="${colSize}">
          <section id="status-bar">
            <div id="bomb-counter">000</div>
            <div id="reset"><img src="images/smiley-face.png"></div>
            <div id="timer">000</div>
          </section>
      </td>
    </tr>
    `;
  boardEl.innerHTML = topRow + `<tr>${'<td class="game-cell"></td>'.repeat(colSize)}</tr>`.repeat(rowSize); 
  boardEl.style.width = sizeLookup[level].tableWidth;
  var cells = Array.from(document.querySelectorAll('td:not(.menu)'));
  cells.forEach(function(cell, idx) {
    cell.setAttribute('data-row', Math.floor(idx / colSize));
    cell.setAttribute('data-col', idx % colSize);    
  });
}


function buildArrays() {
  var arr = Array(rowSize).fill(null); 
  arr = arr.map(function() {
    return new Array(colSize).fill(null);
  }); 
  return arr; 
};

function buildCells(){ 
  board.forEach(function(rowArr, rowIdx) { 
    rowArr.forEach(function(slot, colIdx) {
      board[rowIdx][colIdx] = new Cell(rowIdx, colIdx, board);
    });
  });
  addBombs(); 
}


function getBombCount() {
  var count = 0;
  board.forEach(function(row){
    count += row.filter(function(cell) {
      return cell.isBomb;
    }).length
  });
  return count;
};



function  addBombs() {
  var currentTotalBombs = sizeLookup[level].totalBombs;

  while (currentTotalBombs !== 0) {
    var row = Math.floor(Math.random() * rowSize);
    var col = Math.floor(Math.random() * colSize);
    var currentCell = board[row][col];

    if (!currentCell.isBomb){
      currentCell.isBomb = true;
      currentTotalBombs -= 1;
      
      currentCell.calcAdjBombs();
    }
  }
}

function useItem() {
  if(sessionStorage.getItem("showStart") === "true"){
    while(true){
      var row = Math.floor(Math.random() * rowSize);
      var col = Math.floor(Math.random() * colSize);
      startCell = board[row][col];

      if (!startCell.isBomb && startCell.row >= 3){
        var td = document.querySelector(`[data-row="${startCell.row}"][data-col="${startCell.col}"]`);
        td.style.backgroundColor = "skyblue"
        break;
      }
     }
  }
  
  if(sessionStorage.getItem("revealAll") === "true"){
      setTimeout(unveil,0);
      setTimeout(veil,500);
  }
}


function checkItem(){
  protect.style.backgroundColor = sessionStorage.getItem("protect") === "true" ? "yellow" : "";
}



function getWinner() { 
  for (var row = 0; row<board.length; row++) {
    for (var col = 0; col<board[0].length; col++) {
      var cell = board[row][col];
      if (!cell.revealed && !cell.isBomb) return false;
    }
  } 
  return true;
}

function init() {
  buildTable();
  board = buildArrays();
  buildCells();
  bombCount = getBombCount();
  elapsedTime = 0;

  clearInterval(timerId);

  useItem();
  
  timerId = null;
  hitBomb = false;
  winner = false;
};



function render() {
  checkItem();

  document.getElementById('bomb-counter').innerText = bombCount.toString().padStart(3, '0');
  var seconds = timeElapsed % 60;
  var tdList = Array.from(document.querySelectorAll('[data-row]'));
  
  tdList.forEach(function(td) {
    var rowIdx = parseInt(td.getAttribute('data-row'));
    var colIdx = parseInt(td.getAttribute('data-col'));
    var cell = board[rowIdx][colIdx];

    if (cell.flagged) {
      td.innerHTML = flagImage;
    } 
    else if (cell.revealed) {
      if (cell.isBomb) {
        td.innerHTML = bombImage;
      } else if (cell.adjBombs) {
        td.className = 'revealed'
        td.style.color = colors[cell.adjBombs];
        td.textContent = cell.adjBombs;
      } else {
        td.className = 'revealed'
      }
    } 
    else {
      td.innerHTML = '';
    }
  });
  
  if (hitBomb) {
    document.getElementById('reset').innerHTML = '<img src=images/dead-face.png>';

    gameController.getTotalGameCount({from:accountAddr}, function(err, res) {
      var gameSHA = web3.sha3(mapSize + accountAddr.toString() + res.toNumber());
  
      reward(gameSHA, winner&&!hitBomb); 

    })

  } else if (winner) {
    document.getElementById('reset').innerHTML = '<img src=images/cool-face.png>';
    
    clearInterval(timerId);

    gameController.getTotalGameCount({from:accountAddr}, function(err, res) {
      var gameSHA = web3.sha3(mapSize + accountAddr.toString() + res.toNumber());
      reward(gameSHA, winner&&!hitBomb);
    })
  }
};


function runCodeForAllCells(cb) {
  board.forEach(function(rowArr) {
    rowArr.forEach(function(cell) {
      cb(cell);
    });
  });
}


init();
render(); 



function copyToClipboard(element) {
  var $temp = $("<input>");
  $("body").append($temp);
  $temp.val($(element).text()).select();
  document.execCommand("copy");
  $temp.remove();
}
