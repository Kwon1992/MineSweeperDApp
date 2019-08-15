import React, { Component }from 'react';
import './App.css';
import './css/main.css';

import Web3 from 'web3';

const gameControllerAddr = '0x5A28e776a379034A85c2b77ee2a5c01f21175A64';
const gameControllerABI = [ { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [ { "name": "", "type": "bytes32" } ], "name": "users", "outputs": [ { "name": "gamerID", "type": "address" }, { "name": "totalGameCount", "type": "uint256" }, { "name": "isPlaying", "type": "bool" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "difficulty", "type": "bytes2" }, { "indexed": false, "name": "gameHex", "type": "bytes32" }, { "indexed": false, "name": "useItem", "type": "bool[3]" }, { "indexed": false, "name": "totalGameCount", "type": "uint256" } ], "name": "START", "type": "event" }, { "anonymous": false, "inputs": [], "name": "WIN", "type": "event" }, { "anonymous": false, "inputs": [], "name": "LOSE", "type": "event" }, { "anonymous": false, "inputs": [], "name": "REGISTER", "type": "event" }, { "constant": false, "inputs": [], "name": "buyMagnet", "outputs": [ { "name": "", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function" }, { "constant": true, "inputs": [], "name": "getMagnetBalance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": true, "inputs": [], "name": "getMagnetFieldBalance", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "_useItems", "type": "bool[3]" } ], "name": "useItems", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_difficulty", "type": "bytes2" }, { "name": "_gameCost", "type": "uint8" }, { "name": "_gameHex", "type": "bytes32" }, { "name": "_useItem", "type": "bool[3]" } ], "name": "startGame", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": false, "inputs": [ { "name": "_gameHex", "type": "bytes32" }, { "name": "_isWinner", "type": "bool" } ], "name": "endGame", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [ { "name": "index", "type": "uint256" } ], "name": "getGameResults", "outputs": [ { "name": "difficulty", "type": "bytes2" }, { "name": "result", "type": "uint8" } ], "payable": false, "stateMutability": "view", "type": "function" }, { "constant": false, "inputs": [ { "name": "amount", "type": "uint256" } ], "name": "exchangeTokens", "outputs": [ { "name": "", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function" }, { "constant": true, "inputs": [], "name": "getUserInfo", "outputs": [ { "name": "_gamerID", "type": "address" }, { "name": "_totalGameCount", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function" } ];
var gameController;
var web3;


var account;

var magnetBalance;
var magnetFieldBalance;



var initWeb3 = async () => {
  if (window.ethereum) {
    console.log('recent mode');
    web3 = await new Web3(window.ethereum);
    try {
      // Request account access if needed
      await window.ethereum.enable();
      // Acccounts now exposed
      // this.web3.eth.sendTransaction({/* ... */});
    } catch (error) {
      // User denied account access...
      console.log(`User denied account access error : ${error}`);
    }
  }
// Legacy dapp browsers...
    else if (window.web3) {
    console.log('legacy mode');
    this.web3 = await new Web3(Web3.currentProvider);
    // Acccounts always exposed
    // this.web3.eth.sendTransaction({/* ... */});
  }
// Non-dapp browsers...
  else {
    console.log('Non-Ethereum browser detected. You should consider trying MetaMask!');
  }

  console.log(web3);

//smart contract initiate
  let accounts = await web3.eth.getAccounts();
  account = accounts[0];


  gameController = await new web3.eth.Contract(gameControllerABI, gameControllerAddr); // Contract 연결!!
  console.log(gameController);
  magnetBalance = await gameController.methods.getMagnetBalance().call();
  magnetFieldBalance = await gameController.methods.getMagnetFieldBalance().call();

  console.log(magnetBalance)
  console.log(magnetFieldBalance);


}

initWeb3();


// let pot = await this.lotteryContract.methods.getPot().call();// Contract의 함수 호출
// console.log(pot)
// let owner = await this.lotteryContract.methods.owner().call();
// console.log(owner);
// ~~~~.methods.(함수).[call() / send()]  
// call() : 컨트랙트 내 값 변경없이 읽기만!!
// send() : 트랜잭션 object를 넣어서 값 변경 시 활용
// filter() : 스마트 컨트랙트가 발생시키는 event를 잡아서 처리한다.. 즉 스마트 컨트랙트와 통신할 수 있는 하나의 방법 -- getPastEvents()가 filter의 일종!!
//            web3.eth.Contract()의 event 관련 함수들을 사용하거나 web3.eth.Subscribe()의 websocket을 사용한다.






// class UserInfo extends Component {




// }

class GameMainPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      level: "",
      useItems:[false,false,false],
      itemCost: 0,
      account: "0x0",
      magnetBalance: 0,
      magnetFieldBalace: 0
    };

    // 콜백에서 `this`가 작동하려면 아래와 같이 바인딩 해주어야 합니다.
  }

  //https://velog.io/@kyusung/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EA%B5%90%EA%B3%BC%EC%84%9C-React%EC%97%90%EC%84%9C-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EB%8B%A4%EB%A3%A8%EA%B8%B0
  /*
    onClick={ function() { console.log(this) }} // undefined
    onClick={ () => console.log(this) } // App { ... }

    예제 코드

    this가 가지는 값

      function 스코프 내에서 this는 해당 function을 호출한 객체를 this로 한다.
      화살표 함수 스코프 내에서 this는 정적(Lexical)영역의 상위 객체를 this로 한다.

      왜 window가 아닌 undefined가 나오는 이유

      React는 development 모드에서는 strict mode를 검사하고, production build 에서는 포함되지 않는다.
  */

  // levelClick(e) {
  //   var targetBtn;

  //   targetBtn = e

  //   this.setState(state => ({
  //     isToggleOn: !state.isToggleOn
  //   }));
  // }

  levelClick = async (e) => {
    var targetBtn = e.target.tagName.toLowerCase() === 'img' ? e.target.parentElement : e.target;
    if(targetBtn.childElementCount !== 0) return;

    if(this.state.level !== ""){ // level click이 되었다면....
      if(this.state.level === targetBtn.id.toString()){
        targetBtn.style.backgroundColor = "";
        await this.setState({level: ""});
      }
        // this.levelSelected[targetBtn.id.toString()] = false;
    } else {
      await this.setState({level: targetBtn.id.toString()});
      targetBtn.style.backgroundColor = "yellow";
    }
    console.log(this.state.level);
  }

  itemClick = async (e) => {
    var targetBtn = e.target;
    
    if(targetBtn.childElementCount !== 0) return;

    targetBtn.style.backgroundColor = targetBtn.style.backgroundColor === "" ? "yellow" : "";
    if(targetBtn.style.backgroundColor === "yellow") {
      switch(targetBtn.id){
        case 'protect': 
        await this.setState({itemCost: this.state.itemCost += 10000}); 
        await this.setState({useItems: [true,this.state.useItems[1],this.state.useItems[2]]});
        break;
      case 'showStart': 
        await this.setState({itemCost: this.state.itemCost += 20000}); 
        await this.setState({useItems: [this.state.useItems[0],true,this.state.useItems[2]]});
        break;
      case 'revealAll': 
        await this.setState({itemCost: this.state.itemCost += 30000}); 
        await this.setState({useItems: [this.state.useItems[0],this.state.useItems[1],true]});
        break;
      }
    } else {
      switch(targetBtn.id){
        case 'protect': 
        await this.setState({itemCost: this.state.itemCost -= 10000}); 
        await this.setState({useItems: [false,this.state.useItems[1],this.state.useItems[2]]});
        break;
      case 'showStart': 
        await this.setState({itemCost: this.state.itemCost -= 20000}); 
        await this.setState({useItems: [this.state.useItems[0],false,this.state.useItems[2]]});
        break;
      case 'revealAll': 
        await this.setState({itemCost: this.state.itemCost -= 30000}); 
        await this.setState({useItems: [this.state.useItems[0],this.state.useItems[1],false]});
        break;
      }
    }

    console.log(this.state.useItems);
    console.log(this.state.itemCost);
  }

  purchaseMagnet = async (e) => {
    var purchaseAmount = document.getElementById("buyingTokens").value;

    if(!isNaN(purchaseAmount)) { // 숫자가 아닐때 true
      purchaseAmount = parseInt(purchaseAmount);
      if(Number.isInteger(purchaseAmount)) {
        console.log("inIF_2");
        purchaseAmount = 100000000000000 * purchaseAmount;
        gameController.methods.buyMagnet().send({from:account, value:purchaseAmount}).on('transactionHash', (hash) => {
          console.log(hash);
          
        // wait.... - response!
        this.updateMagnet();
        // update magnet Balance of Front
        });

      } 
    }else {
      alert("Write only Integer!");
    }
  }


  updateInfo = async(e) => {
    await this.updateAddr();
    await this.updateMagnet();
    await this.updateMagnetField();
  }
  updateAddr = async (e) => {
    document.getElementById('user-name').innerHTML = account;
  }

  updateMagnet = async (e) => {
    this.setState({magnetBalance: await gameController.methods.getMagnetBalance().call()});
    document.getElementById('MagnetTokens').innerHTML = this.state.magnetBalance;
    console.log('update!');
  }

  updateMagnetField = async (e) => {
    this.setState({magnetFieldBalance: await gameController.methods.getMagnetFieldBalance().call()}); 
    document.getElementById('MagnetFieldTokens').innerHTML = this.state.magnetFieldBalance;
    return this.state.magnetFieldBalance;
  }

  render() {
    return (
      <div> 
        <b className="user-info">User Address: </b><div className="user-info" id="user-name" ></div>
        <b className="user-info" >Magnet: </b> <div className="user-info"  id="MagnetTokens" > </div>
        <b className="user-info">Magnet Field: </b><div className="user-info" id="MagnetFieldTokens"></div>
        <button className="user-info" onClick={this.updateInfo}> LOG-IN</button>
        <div> 
          <h1>MineSweeper</h1>
          <div id="size-btns" style={{width: 'auto'}}>
            <div id="size-btns"><button className="level" onClick={this.levelClick} id="EZ"> Easy</button></div> 
            <div id="size-btns"><button className="level" onClick={this.levelClick} id="NM"> Medium</button></div>
            <div id="size-btns"><button className="level" onClick={this.levelClick} id="HD"> Hard</button></div>
          </div>
        </div>
        <br />
        <div> 
          <h2>Select Items (Use MagnetField)</h2>
          (Protect : 10000 / Marker : 20000 / REVEAL : 30000)<br />
          <div id="item-btns">
            <div id="item-btns"><button className="item" onClick={this.itemClick} id="protect">PROECT BOMB</button></div>
            <div id="item-btns"><button className="item" onClick={this.itemClick} id="showStart">START MARKER</button></div> 
            <div id="item-btns"><button className="item" onClick={this.itemClick} id="revealAll">REVEAL MAP</button></div> 
          </div>
        </div> 
        <br />
        <br />
        {/* <h3>please use landscape mode when you play above the normal level in mobile.</h3> */}
        <div> 
          <button id="start-btn" type="button">GAME START</button>
          <button id="explain-btn" type="button" onClick={this.slideDown}>HOW TO PLAY</button>
        </div> 
        <br /><br /><br />
        <b>Buy Magnet: </b><input type="text" id="buyingTokens" placeholder="write integer only." /><button id="purchase-btn" onClick={this.purchaseMagnet} type="button">BUY</button>
      </div>

      
    );
  }
};


class Modal extends Component {
  render() {
    return (
      <div id="myModal" className="modal">
      <div className="modal-content">
        <h1 style={{textAlign: 'center'}}>HOW TO PLAY</h1>

        <p style={{lineHeight: '1.5'}}>Left Click to open the cell </p>
        <p style={{lineHeight: '1.5'}}>If you open a bomb, you will lose the game. </p>
        <p style={{lineHeight: '1.5'}}>Use flag properly to WIN the game. </p>
        <p style={{lineHeight: '1.5'}}>Right Click(Long Press for Mobile) to mark a flag.</p>

        <br /><br />

        <h1 style={{textAlign: 'center'}}>ITEM DESCRIPTION</h1>

        <p style={{lineHeight: '1.5'}}><b>Protect</b> </p>
        <p style={{lineHeight: '1.5'}}>When you click the cell which has a bomb, it will protect you from defeat and mark a flag.</p>
        <p style={{lineHeight: '1.5'}}><b>Start Pin</b> </p>
        <p style={{lineHeight: '1.5'}}>Show only one cell which does not a bomb before the game begin. </p>
        <p style={{lineHeight: '1.5'}}>If you reveal another cell, the mark will be disappeared.</p>
        <p style={{lineHeight: '1.5'}}><b>Reveal MAP</b> </p>
        <p style={{lineHeight: '1.5'}}>Show 1/5 of map for 0.5 seconds. </p>
        <p><br /></p>

        <div id="close-btn" style={{cursor: 'pointer', backgroundColor: '#DDDDDD', textAlign: 'center', paddingBottom: '10px', paddingTop: '10px'}}>CLOSE</div>
      </div>
      <input className="textBox" type="text" id="modalBox" style={{display: 'none'}} />
    </div>
    );
  }
}


// let lotteryAddress = '0xe5269d1B96fe86e45675bBA41029F6c9fC3BF5F5';
// let lotteryABI = [ { "constant": true, "inputs": [], "name": "answerForTest", "outputs": [ { "name": "", "type": "bytes32" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x84f7e4f0" }, { "constant": true, "inputs": [], "name": "owner", "outputs": [ { "name": "", "type": "address" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x8da5cb5b" }, { "inputs": [], "payable": false, "stateMutability": "nonpayable", "type": "constructor", "signature": "constructor" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "BET", "type": "event", "signature": "0x100791de9f40bf2d56ffa6dc5597d2fd0b2703ea70bc7548cd74c04f5d215ab7" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answer", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "WIN", "type": "event", "signature": "0x8219079e2d6c1192fb0ff7f78e6faaf5528ad6687e69749205d87bd4b156912b" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answer", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "FAIL", "type": "event", "signature": "0x3b19d607433249d2ebc766ae82ca3848e9c064f1febb5147bc6e5b21d0adebc5" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answer", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "DRAW", "type": "event", "signature": "0x72ec2e949e4fad9380f9d5db3e2ed0e71cf22c51d8d66424508bdc761a3f4b0e" }, { "anonymous": false, "inputs": [ { "indexed": false, "name": "index", "type": "uint256" }, { "indexed": false, "name": "bettor", "type": "address" }, { "indexed": false, "name": "amount", "type": "uint256" }, { "indexed": false, "name": "challenges", "type": "bytes1" }, { "indexed": false, "name": "answerBlockNumber", "type": "uint256" } ], "name": "REFUND", "type": "event", "signature": "0x59c0185881271a0f53d43e6ab9310091408f9e0ff9ae2512613de800f26b8de4" }, { "constant": true, "inputs": [], "name": "getPot", "outputs": [ { "name": "pot", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x403c9fa8" }, { "constant": false, "inputs": [ { "name": "challenges", "type": "bytes1" } ], "name": "betAndDistribute", "outputs": [ { "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function", "signature": "0xe16ea857" }, { "constant": false, "inputs": [ { "name": "challenges", "type": "bytes1" } ], "name": "bet", "outputs": [ { "name": "result", "type": "bool" } ], "payable": true, "stateMutability": "payable", "type": "function", "signature": "0xf4b46f5b" }, { "constant": false, "inputs": [], "name": "distribute", "outputs": [], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0xe4fc6b6d" }, { "constant": false, "inputs": [ { "name": "answer", "type": "bytes32" } ], "name": "setAnswerForTest", "outputs": [ { "name": "result", "type": "bool" } ], "payable": false, "stateMutability": "nonpayable", "type": "function", "signature": "0x7009fa36" }, { "constant": true, "inputs": [ { "name": "challenges", "type": "bytes1" }, { "name": "answer", "type": "bytes32" } ], "name": "isMatch", "outputs": [ { "name": "", "type": "uint8" } ], "payable": false, "stateMutability": "pure", "type": "function", "signature": "0x99a167d7" }, { "constant": true, "inputs": [ { "name": "index", "type": "uint256" } ], "name": "getBetInfo", "outputs": [ { "name": "answerBlockNumber", "type": "uint256" }, { "name": "bettor", "type": "address" }, { "name": "challenges", "type": "bytes1" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x79141f80" }, { "constant": true, "inputs": [], "name": "getETH", "outputs": [ { "name": "", "type": "uint256" } ], "payable": false, "stateMutability": "view", "type": "function", "signature": "0x14f6c3be" } ];



class App extends Component {

  render() {
    return (
      <div className="App">
        <GameMainPage></GameMainPage>
        <Modal></Modal>
      <script src="./js/index.js"></script>
      </div>
    );
  }
}

export default App;
