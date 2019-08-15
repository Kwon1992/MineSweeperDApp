let controllerAddr="0x8dEE5aAd3dBe1d3214145AE31853520E197F4B88",controllerAbi=[ { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "users", "outputs": [ { "name": "gamerID", "type": "address" }, { "name": "totalGameCount", "type": "uint256" }, { "name": "isPlaying", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "difficulty", "type": "bytes2" }, { "indexed": false, "name": "gameHex", "type": "bytes32" }, { "indexed": false, "name": "useItem", "type": "bool[3]" }, { "indexed": false, "name": "totalGameCount", "type": "uint256" } ], "name": "START", "type": "event" }, { "anonymous": false, "inputs": [], "name": "WIN", "type": "event" }, { "anonymous": false, "inputs": [], "name": "LOSE", "type": "event" }, { "anonymous": false, "inputs": [], "name": "REGISTER", "type": "event" }, { "constant": false, "inputs": [], "name": "buyMagnet", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "getMagnetBalance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getMagnetFieldBalance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_useItems", "type": "bool[3]" } ], "name": "useItems", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_difficulty", "type": "bytes2" }, { "name": "_gameCost", "type": "uint8" }, { "name": "_gameHex", "type": "bytes32" }, { "name": "_useItem", "type": "bool[3]" } ], "name": "startGame", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_gameHex", "type": "bytes32" }, { "name": "_isWinner", "type": "bool" } ], "name": "endGame", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "index", "type": "uint256" } ], "name": "getGameResults", "outputs": [ { "name": "difficulty", "type": "bytes2" }, { "name": "result", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "amount", "type": "uint256" } ], "name": "exchangeTokens", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getUserInfo", "outputs": [ { "name": "_gamerID", "type": "address" }, { "name": "_totalGameCount", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ];

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
  loadContract();
  loadUserInfo();
  console.log(web3);
  console.log(sessionStorage);
});


var accountAddr;

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



// 1ETH = 1 * (10^14)
// 1Magnet = 0.0001ETH
// NMagnet = 0.0001 * N
document.getElementById('purchase-btn').addEventListener('click', function() {
  purchaseAmount = document.getElementById("buyingTokens").value;
  if(!isNaN(purchaseAmount)) {
    purchaseAmount = parseInt(purchaseAmount);
    if(Number.isInteger(purchaseAmount)) {
      purchaseAmount = 100000000000000 * purchaseAmount;
      console.log(purchaseAmount);
      gameController.buyMagnet({from:accountAddr, value:purchaseAmount}, function(res) {
        console.log(res);
      });
    }
  } else {
    alert("Write only Integer!");
  }
});

var curMagnetBalance;

document.getElementById('start-btn').addEventListener('click', function() {

      gameController.getMagnetBalance( function(e,r) {
        curMagnetBalance = r;
      });

    if(mapSize === "") {
      alert("No Level Selected");
    } else if(curMagnetBalance < 10) {
      alert("Not Enought Tokens");
    }
});
    //     return;
    // } else if(itemCost > parseInt(document.getElementById('bmtTokens').innerText)){
    //     alert("You cannot buy items.(Not enought Tokens.)");
    //     return;
    // } else {

    //     for (const level in levelSelected) {
    //       if (levelSelected.hasOwnProperty(level) && levelSelected[level] ) {
    //         sessionStorage.setItem("level", level);
    //       }
    //     }
    
    //     for (const item in itemSelected) {
    //       if (itemSelected.hasOwnProperty(item)) {
    //         sessionStorage.setItem(item, itemSelected[item]);
    //       }
    //     }
    // }
    //   // 아이템 구매 시 코인(토큰) 감소 요청 txn 전송

    //   $.ajax({
    //     type:"get",
    //     url:"game.html",
    //     success: function test(a) {
    //       $(".flex-body").html(a);
    //     }
    //    });
 


//variables
// Secondary Functions (부차적 함수)
function getLink(addr) {
    return '<a target="_blank" href=https://rinkeby.etherscan.io/address/' + addr + '>' + addr +'</a>';
}


// function thousandSeparatorCommas ( number ){ 
//   var string = "" + number; 
//   string = string.replace( /[^-+\.\d]/g, "" );
//   var regExp = /^([-+]?\d+)(\d{3})(\.\d+)?/; 
//   while ( regExp.test( string ) ) string = string.replace( regExp, "$1" + "," + "$2" + "$3" ); 
//   return string; 
// } 



var mapSize = "";
var itemCost = 0;
var levelSelected = {
  "EZ": false, 
  "NM": false, 
  "HD": false
}; //EZ , NM, HD // SHD

var itemSelected = {
  "protect" : false,
  "showStart" : false,
  "revealAll" : false
}; // protect, predict



document.getElementById('size-btns').addEventListener('click', function(e) { // size-btns을 클릭한 경우... e : 이벤트 발생 객체

  targetBtn = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target;

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
  }

  console.log(levelSelected);
});


document.getElementById('item-btns').addEventListener('click', function (e){
  targetBtn = e.target;

  if(targetBtn.childElementCount != 0) return;

  targetBtn.style.backgroundColor = targetBtn.style.backgroundColor === "" ? "yellow" : "";
  if(targetBtn.style.backgroundColor === "yellow") {
    itemSelected[targetBtn.id.toString()] = true;
    switch(targetBtn.id){
      case 'protect': itemCost += 2500; break;
      case 'showStart': itemCost += 4000; break;
      case 'revealAll': itemCost += 10000; break;
    }
  } else {
    itemSelected[targetBtn.id.toString()] = false;
    switch(targetBtn.id){
      case 'protect': itemCost -= 2500; break;
      case 'showStart': itemCost -= 4000; break;
      case 'revealAll': itemCost -= 10000; break;
    }
  }
});


document.getElementById('explain-btn').addEventListener('click', function (e){
  $('#myModal').slideDown();
  document.getElementById('close-btn').addEventListener('click', function (e){
    $('#myModal').slideUp();
   });
 });

  
//https://blog.naver.com/PostView.nhn?blogId=psj9102&logNo=220821359506&proxyReferer=https%3A%2F%2Fwww.google.com%2F
//Ajax를 이용한 비동기 방식의 페이지 이동 (refresh 없이 특정 div만 내용 변경!!)
