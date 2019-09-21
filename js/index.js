const controllerAddr="0x6F467E5A03c5b10Bf8Ab9EFB02D93f6D1DA25C06",controllerAbi=[{"constant": true,"inputs": [],"name": "owner","outputs": [{"name": "","type": "address"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "","type": "bytes32"}],"name": "users","outputs": [{"name": "gamerID","type": "address"},{"name": "totalGameCount","type": "uint256"},{"name": "isPlaying","type": "bool"}],"payable": false,"stateMutability": "view","type": "function"},{"inputs": [],"payable": false,"stateMutability": "nonpayable","type": "constructor"},{"anonymous": false,"inputs": [{"indexed": false,"name": "difficulty","type": "bytes2"},{"indexed": false,"name": "gameHex","type": "bytes32"},{"indexed": false,"name": "useItem","type": "bool[3]"},{"indexed": false,"name": "totalGameCount","type": "uint256"}],"name": "START","type": "event"},{"anonymous": false,"inputs": [],"name": "WIN","type": "event"},{"anonymous": false,"inputs": [],"name": "LOSE","type": "event"},{"anonymous": false,"inputs": [],"name": "REGISTER","type": "event"},{"constant": false,"inputs": [],"name": "buyMagnet","outputs": [{"name": "","type": "bool"}],"payable": true,"stateMutability": "payable","type": "function"},{"constant": false,"inputs": [{"name": "sellAmount","type": "uint256"}],"name": "sellMagnet","outputs": [{"name": "","type": "bool"}],"payable": true,"stateMutability": "payable","type": "function"},{"constant": false,"inputs": [],"name": "buyMagnetField","outputs": [{"name": "","type": "bool"}],"payable": true,"stateMutability": "payable","type": "function"},{"constant": true,"inputs": [],"name": "getMagnetBalance","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "getMagnetFieldBalance","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_useItems","type": "bool[3]"}],"name": "useItems","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "_difficulty","type": "bytes2"},{"name": "_gameCost","type": "uint8"},{"name": "_gameHex","type": "bytes32"},{"name": "_useItem","type": "bool[3]"}],"name": "startGame","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": false,"inputs": [{"name": "_gameHex","type": "bytes32"},{"name": "_isWinner","type": "bool"},{"name": "userAddr","type": "address"}],"name": "endGame","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "getTotalGameCount","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [{"name": "index","type": "uint256"}],"name": "getGameResults","outputs": [{"name": "difficulty","type": "bytes2"},{"name": "gameHex","type": "bytes32"},{"name": "result","type": "uint8"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [{"name": "_amount","type": "uint256"}],"name": "exchangeTokens","outputs": [{"name": "","type": "bool"}],"payable": false,"stateMutability": "nonpayable","type": "function"},{"constant": true,"inputs": [],"name": "getUserInfo","outputs": [{"name": "_gamerID","type": "address"},{"name": "_totalGameCount","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": true,"inputs": [],"name": "showETH","outputs": [{"name": "","type": "uint256"}],"payable": false,"stateMutability": "view","type": "function"},{"constant": false,"inputs": [],"name": "withdrawETHALL","outputs": [],"payable": false,"stateMutability": "nonpayable","type": "function"}];
// kovan contract : 0x6F467E5A03c5b10Bf8Ab9EFB02D93f6D1DA25C06

var mapSize = "";
var itemCost = 0;
var seconds = 10;

var levelSelected = {
  "EZ": false, 
  "NM": false, 
  "HD": false,
};

var itemSelected = {
  "protect" : false,
  "showStart" : false,
  "revealAll" : false
}; 

var itemSelectedForContract = [false, false, false];
var accountAddr;
var gameController;



//Event Listeners
window.addEventListener('load', function() {
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));
  }
});



 
function loadContract() {
  gameControllerContract = web3.eth.contract(controllerAbi);
  gameController = gameControllerContract.at(controllerAddr);
}

//Core Functions
function loadUserInfo(){
  web3.eth.getAccounts(function(e,r){ 
    document.getElementById('user-name').innerHTML =  r[0];
    accountAddr = r[0];
    getTokens();
  });
}


function getTokens() {
  gameController.getMagnetBalance((e,r)=> {
    document.getElementById('MagnetTokens').innerHTML = r;
  });
  
  gameController.getMagnetFieldBalance((e,r)=> {
    document.getElementById('MagnetFieldTokens').innerHTML = r;
  });
}

document.getElementById('size-btns').addEventListener('click', function(e) {

  var targetBtn = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target;

  if(targetBtn.childElementCount != 0) return;

  if(levelSelected["EZ"] || levelSelected["NM"] || levelSelected["HD"]){
    if(levelSelected[targetBtn.id.toString()]) {
      targetBtn.style.backgroundColor = "";
      levelSelected[targetBtn.id.toString()] = false;
      mapSize = "";
    }
  } else {
    mapSize = targetBtn.id.toString();
    targetBtn.style.backgroundColor = "yellow";
    levelSelected[targetBtn.id.toString()] = true;      
    sessionStorage.setItem("level", mapSize);
  }
});


document.getElementById('item-btns').addEventListener('click', async function (e){
  targetBtn = e.target;

  if(targetBtn.childElementCount != 0) return;

  targetBtn.style.backgroundColor = targetBtn.style.backgroundColor === "" ? "yellow" : "";
  if(targetBtn.style.backgroundColor === "yellow") {      
    switch(targetBtn.id){
      case 'protect': 
      itemCost = itemCost + 10000;    itemSelected[targetBtn.id.toString()] = true;
      itemSelectedForContract = [true, itemSelectedForContract[1], itemSelectedForContract[2]]; 
        break;
      case 'showStart':         
        itemCost = itemCost + 20000;    itemSelected[targetBtn.id.toString()] = true;
        itemSelectedForContract = [itemSelectedForContract[0], true, itemSelectedForContract[2]]; 
        break;
      case 'revealAll': 
        itemCost = itemCost + 30000;    itemSelected[targetBtn.id.toString()] = true;
        itemSelectedForContract = [itemSelectedForContract[0], itemSelectedForContract[1], true]; 
        break;
      default:
        console.log("unexpected Value :itemClick")
    } 
  } else {
    switch(targetBtn.id){
      case 'protect': 
      itemCost -= 10000;    itemSelected[targetBtn.id.toString()] = false;
      itemSelectedForContract = [false, itemSelectedForContract[1], itemSelectedForContract[2]];
      break;
    case 'showStart': 
      itemCost -= 20000;    itemSelected[targetBtn.id.toString()] = false;
      itemSelectedForContract = [itemSelectedForContract[0], false, itemSelectedForContract[2]];
      break;
    case 'revealAll': 
      itemCost -= 30000;    itemSelected[targetBtn.id.toString()] = false; 
      itemSelectedForContract = [itemSelectedForContract[0], itemSelectedForContract[1], false];
      break;
    default:
      console.log("unexpected Value :itemClick")
    }
  }
});


document.getElementById('explain-btn').addEventListener('click', function (e){
  $('#myModal').slideDown();
  document.getElementById('close-btn').addEventListener('click', function (e){
    $('#myModal').slideUp();
   });
 });



// 1ETH = 1 * (10^14)
// 1 Magnet = 0.001ETH
// N Magnet = 0.001 * N
document.getElementById('purchase-btn').addEventListener('click', function() {
  purchaseAmount = document.getElementById("buyingTokens").value;
  if(!isNaN(purchaseAmount)) {
    purchaseAmount = parseInt(purchaseAmount);
    if(Number.isInteger(purchaseAmount)) {
      purchaseAmount = 1000000000000000 * purchaseAmount;
      gameController.buyMagnet({from:accountAddr, value:purchaseAmount}, function(err, res) {
        if(err){
          alert("Error occured when buying Magnet. Maybe you Denied the txn.")
          return;
        }
        alert("Token Buy Complete! If Token balance doesn't updated, Refresh your browser")
        loadUserInfo();
      });
    }
  } else {
    alert("Write only Integer!");
  }

});


// 100 MagnetField == 1 Magnet
document.getElementById('exchange-btn').addEventListener('click', function() {
  exchangeAmount = document.getElementById("exchangeTokens").value;
  if(!isNaN(exchangeAmount)) {
    exchangeAmount = parseInt(exchangeAmount);
    if(Number.isInteger(exchangeAmount)) {
      gameController.getMagnetFieldBalance({from:accountAddr}, function(err,res) {
        if(err) {
          alert("Error occured when searching your MagnetField Balance. Maybe you Denied the txn.")
          return;
        }
        if(exchangeAmount > res || exchangeAmount < 50000) {
          alert("Not enough MagnetField Balance OR Not reach Minimum requirements.")
        } else {
          gameController.exchangeTokens(exchangeAmount, function(err,res) {
            if(err) {
              alert("Error occured when exchange MagnetField to Magnet. Maybe your balance is insufficient")
              return;
            }
            alert(`Exchange Success: ${exchangeAmount} MagnetField to ${exchangeAmount/100} Magnet`);
            loadUserInfo();
          })
        }
      })
    }
  }
});


document.getElementById('sell-btn').addEventListener('click', function() {
  purchaseAmount = document.getElementById("sellingTokens").value;
  if(!isNaN(purchaseAmount)) {
    purchaseAmount = parseInt(purchaseAmount);
    if(Number.isInteger(purchaseAmount)) {
      gameController.sellMagnet(purchaseAmount, function(err, res) {
        if(err){
          alert("Denied to sell the token.")
          return;
        }
        alert("Token Sell Complete! If Token balance doesn't updated, Refresh your browser")
        loadUserInfo();
      });
    }
  } else {
    alert("Write only Integer!");
  }
});


var curMagnetBalance;
var curMagnetFieldBalance;
document.getElementById('start-btn').addEventListener('click', function() { 
  gameController.getMagnetBalance( function(e,r) {
    curMagnetBalance = r;
  });

  gameController.getMagnetFieldBalance( function(e,r) {
    curMagnetFieldBalance = r;
  });


  if(mapSize === "") {
    alert("No Level Selected");
    return;
  } else if(curMagnetBalance < 10) {
    alert("Not Enough Magnet Tokens");
    return;
  } else if(curMagnetFieldBalance < itemCost ){
    alert("Not Enough MagnetField Tokens")
    return;
  } else {


    for (const item in itemSelected) {
      if (itemSelected.hasOwnProperty(item)) {
        sessionStorage.setItem(item, itemSelected[item]);
      }
    }

    gameController.getTotalGameCount({from:accountAddr}, function(err, res) {
      var gameSHA = web3.sha3(mapSize + accountAddr.toString() + (res.toNumber()+1));
      gameController.startGame(web3.fromAscii(mapSize), 10, gameSHA, itemSelectedForContract, (err, res) => {
        if(err) {
          alert("You Denied to play the game.")
          return;
        }
        $.ajax({
          type:"get",
          url:"game.html",
          success: function test(a) {
            $('#timerBox').show();
            var makeTimer = setInterval(function() { 
              seconds--;
              $("#seconds").html(seconds); 
              if(seconds < 0) {
                clearInterval(makeTimer);
              }
            }, 1000);
            setTimeout(function() {
              $(".flex-body").html(a);
            }, 10000);
          }
         });
      });
    })
  }
});




function getGameResults() {
  let recentGameIndex;
  const table = document.getElementById("history-table");
  var userResultData ="";
  var i = 0;
  web3.eth.getAccounts(function(err,res){
    gameController.getTotalGameCount( function(err,res) {
   
      recentGameIndex = 0;
      if(err) {
        return ;
      } else {
        recentGameIndex = (res.toNumber());
        while(recentGameIndex >0 && i <5) {
          gameController.getGameResults(recentGameIndex, (err, res) => {
            userResultData += `<tr><td>${convertToDifficulty(res[0])}</td><td>${res[1]}</td><td>${res[2].toNumber() === 0? 'WIN' : 'LOSE'}</td></tr>`
            var tableContents = `<thead>
            <tr>
                <th>Difficulty</th><th>Game Hash</th><th>Result</th>
            </tr>
            </thead>
            <tbody>`+ userResultData + `</tbody>`;
            table.innerHTML = tableContents; 
          });
          recentGameIndex--;
          i++;
        }
      }
    })
  })
}


function convertToDifficulty(_asciiCodes) {
  var char1 = _asciiCodes.substring(0,4);
  var char2 = _asciiCodes.substring(0,2) + _asciiCodes.substring(4,6);
  var result = String.fromCharCode(char1) + String.fromCharCode(char2);
  return result;
}






async function initIndexPage() {
  await loadContract();
  await loadUserInfo();
  await getGameResults();
}


initIndexPage();


document.getElementById('magnetField-btn').addEventListener('click', function() {
  gameController.buyMagnetField(function (err,res) {
    alert("Token Buy Complete! If Token balance doesn't updated, Refresh your browser")
    loadUserInfo();
    return;
  });
})