const controllerAddr="0xa7685F999Bf5A7391a9EEA252b3B74ef1637f775",controllerAbi=[ { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x8da5cb5b" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "users", "outputs": [ { "name": "gamerID", "type": "address" }, { "name": "totalGameCount", "type": "uint256" }, { "name": "isPlaying", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xcea6ab98" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor", "signature": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "difficulty", "type": "bytes2" }, { "indexed": false, "name": "gameHex", "type": "bytes32" }, { "indexed": false, "name": "useItem", "type": "bool[3]" }, { "indexed": false, "name": "totalGameCount", "type": "uint256" } ], "name": "START", "type": "event", "signature": "0xc7ac18fce2161ed5213e36b291b3e1338d444d67b7fc2a53f66fb1776ff7b5ae" }, { "anonymous": false, "inputs": [], "name": "WIN", "type": "event", "signature": "0xa9b48ba7eb46d59a96fea22bbc7e53c3af344d9c75ee09e78b0f32ca4f8c2a8f" }, { "anonymous": false, "inputs": [], "name": "LOSE", "type": "event", "signature": "0x8fd268e19e11911908022dbdaf0fb3c386fc668c496b50cdf278bb9ea3c02712" }, { "anonymous": false, "inputs": [], "name": "REGISTER", "type": "event", "signature": "0xe8a28dd752e9fdb6ffdd08908cf27efb2415fd5ddfa28abcf0b87bc7178f0ba8" }, { "constant": false, "inputs": [], "name": "buyMagnet", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function", "signature": "0x083c3daa" }, { "constant": false, "inputs": [ { "name": "sellAmount", "type": "uint256" } ], "name": "sellMagnet", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function", "signature": "0xc20dd1a0" }, { "constant": false, "inputs": [], "name": "buyMagnetField", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function", "signature": "0xa90b6839" }, { "constant": true, "inputs": [], "name": "getMagnetBalance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xb6d991cf" }, { "constant": true, "inputs": [], "name": "getMagnetFieldBalance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xdfef09d9" }, { "constant": false, "inputs": [ { "name": "_useItems", "type": "bool[3]" } ], "name": "useItems", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x801330aa" }, { "constant": false, "inputs": [ { "name": "_difficulty", "type": "bytes2" }, { "name": "_gameCost", "type": "uint8" }, { "name": "_gameHex", "type": "bytes32" }, { "name": "_useItem", "type": "bool[3]" } ], "name": "startGame", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xf598963e" }, { "constant": false, "inputs": [ { "name": "_gameHex", "type": "bytes32" }, { "name": "_isWinner", "type": "bool" } ], "name": "endGame", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x78df5b40" }, { "constant": true, "inputs": [], "name": "getTotalGameCount", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xa8667b3c" }, { "constant": true, "inputs": [ { "name": "index", "type": "uint256" } ], "name": "getGameResults", "outputs": [ { "name": "difficulty", "type": "bytes2" }, { "name": "result", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0xdcef63eb" }, { "constant": false, "inputs": [ { "name": "amount", "type": "uint256" } ], "name": "exchangeTokens", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x40477126" }, { "constant": true, "inputs": [], "name": "getUserInfo", "outputs": [ { "name": "_gamerID", "type": "address" }, { "name": "_totalGameCount", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x5d8d1585" } ];


var mapSize = "";
var itemCost = 0;

var levelSelected = {
  "EZ": false, 
  "NM": false, 
  "HD": false,
}; //EZ , NM, HD // SHD

var itemSelected = {
  "protect" : false,
  "showStart" : false,
  "revealAll" : false
}; 

var itemSelectedForContract = [false, false, false]; // protect, marker, show

// connect with contracts.
var accountAddr;
var gameController;



//Event Listeners
window.addEventListener('load', function() {
  //Assign Metamask to window.web3 var
  if (typeof web3 !== 'undefined') {
    window.web3 = new Web3(web3.currentProvider);
  } else {
    console.log('No web3? You should consider trying MetaMask!')
    window.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8080"));
  }
  // Now you can start your app & access web3 freely:
  // startApp()?
  console.log(web3);
  console.log(sessionStorage);
});




function loadContract() {
  gameControllerContract = web3.eth.contract(controllerAbi); // Tokens Controller
  gameController = gameControllerContract.at(controllerAddr);
}

//Core Functions (핵심 함수)
function loadUserInfo(){
  web3.eth.getAccounts(function(e,r){ 
    document.getElementById('user-name').innerHTML =  r[0];
    accountAddr = r[0];
  });
  getTokens();
}


function getTokens() {
  gameController.getMagnetBalance((e,r)=> {
    document.getElementById('MagnetTokens').innerHTML = r;
  });
  
  gameController.getMagnetFieldBalance((e,r)=> {
    document.getElementById('MagnetFieldTokens').innerHTML = r;
  });
}

document.getElementById('size-btns').addEventListener('click', function(e) { // size-btns을 클릭한 경우... e : 이벤트 발생 객체

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

  console.log(levelSelected);
  console.log(sessionStorage);
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

  console.log(itemCost);
  console.log(itemSelected);
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
      console.log(purchaseAmount);
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


// 100 MagnetField == 1 MagnetField

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
          console.log("into else!!");
          gameController.exchangeTokens(exchangeAmount, function(err,res) {
            if(err) {
              console.log(err)
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
    1000
    console.log(purchaseAmount);
    if(Number.isInteger(purchaseAmount)) {
      gameController.sellMagnet(purchaseAmount, function(err, res) {
        if(err){
          alert("Denied to sell the token.")
          return;
        }
        console.log(res);
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
    console.log(r);
    curMagnetFieldBalance = r;
  });


  if(mapSize === "") {
    alert("No Level Selected");
    console.log();
    return;
  } else if(curMagnetBalance < 10) {
    alert("Not Enough Magnet Tokens");
    return;
  } else if(curMagnetFieldBalance < itemCost ){
    alert("Not Enough MagnetField Tokens")
    return;
  } else {

    var gameSHA = web3.sha3(mapSize+ accountAddr.toString()+ Date.now());
    console.log(`gameSHA : ${gameSHA}`);
    sessionStorage.setItem("gameID", gameSHA);

    for (const item in itemSelected) {
      if (itemSelected.hasOwnProperty(item)) {
        sessionStorage.setItem(item, itemSelected[item]);
      }
    }

    console.log(sessionStorage);
    gameController.startGame(web3.fromAscii(mapSize), 10, gameSHA, itemSelectedForContract, (err, res) => {
      if(err) {
        alert("You Denied to play the game.")
        return;
      }
      $.ajax({
        type:"get",
        url:"game.html",
        success: function test(a) {
          $(".flex-body").html(a);
        }
       });
       console.log(sessionStorage)
       console.log(res); // txn reciept hash?
    });
  }
});

//https://wallel.com/onclick-링크-새창팝업현재창프레임/
// document.getElementById('history-btn').addEventListener('click', function() {
//   window.open('./history.html', 'game-result-history', 'width=430,height=500,location=no,status=no,scrollbars=yes');
// })

// game history
function getGameResults() {
  var table = document.getElementById("history-table");

  var recentGameIndex;
  var gameResults = [];

  gameController.getTotalGameCount(function(err,res) {
    if(err) {
      console.log(err);
      recentGameIndex = 0;
      return ;
    } else {
      console.log(res);
      recentGameIndex = res.toNumber() - 1;
      console.log(recentGameIndex);

      while(recentGameIndex >= 0) { 
        console.log(`in getGameResult`);
          gameController.getGameResults(recentGameIndex,function(err,res) {
            console.log(res);
            gameResults.push(res);
            console.log(recentGameIndex);
            console.log(gameResults);
            recentGameIndex--;
          });
      } 
    }
  });
}


async function initHistory() {

  userResultData = await getGameResults();

  var tableContents = `<thead>
  <tr>
      <th>Index</th><th>Level</th><th>gameHex</th><th>Result</th>
  </tr>
  </thead>
  <tbody>` + userResultData + `</tbody>`;
  
  console.log(userResultData);
  // parsing userResultData and convert to table row for show in html files.
  // table.innerHTML = userResultData; 
}


async function initIndexPage() {
  await loadContract();
  await loadUserInfo();
  await initHistory();
}



initIndexPage();



//variables
// Secondary Functions (부차적 함수)
function getLink(addr) {
    return '<a target="_blank" href=https://rinkeby.etherscan.io/address/' + addr + '>' + addr +'</a>';
}
  
//https://blog.naver.com/PostView.nhn?blogId=psj9102&logNo=220821359506&proxyReferer=https%3A%2F%2Fwww.google.com%2F
//Ajax를 이용한 비동기 방식의 페이지 이동 (refresh 없이 특정 div만 내용 변경!!)

// 없앨 함수

document.getElementById('magnetField-btn').addEventListener('click', function() {
  gameController.buyMagnetField(function (err,res) {
    alert("Token Buy Complete! If Token balance doesn't updated, Refresh your browser")
    loadUserInfo();
    return;
  });
})