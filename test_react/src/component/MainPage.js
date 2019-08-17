import React, { Component }from 'react';
import Web3 from 'web3';


const gameControllerAddr = '0x79f23aA941eB2012aa6E6169668b14B2Fa408949';
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

class MainPage extends Component {

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
  }

  //https://velog.io/@kyusung/%EB%A6%AC%EC%95%A1%ED%8A%B8-%EA%B5%90%EA%B3%BC%EC%84%9C-React%EC%97%90%EC%84%9C-%EC%9D%B4%EB%B2%A4%ED%8A%B8-%EB%8B%A4%EB%A3%A8%EA%B8%B0



  // attached Event Listeners...
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
      default:
        console.log("unexpected Value :itemClick")
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
      default:
        console.log("unexpected Value :itemClick")
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
    return this.state.magnetBalance;
  }

  updateMagnetField = async (e) => {
    this.setState({magnetFieldBalance: await gameController.methods.getMagnetFieldBalance().call()}); 
    document.getElementById('MagnetFieldTokens').innerHTML = this.state.magnetFieldBalance;
    return this.state.magnetFieldBalance;
  }

  startGame = async (e) => {
    console.log("start Game!!");
    if(this.state.level === "") { 
      console.log("No LEVEL SELECTED!!");
      console.log(web3.utils.fromAscii("EZ"))
      return; 
    }
    var result = [];
    
    for (var i = 0; i < this.state.level.length; i++) {
      result.push(this.state.level.charCodeAt(i));
    }



    console.log(result)
    gameController.methods.startGame(web3.utls.fromAscii("EZ"), 10, '0x427F326E482582B413D44740657DEE66926ED69E82CF5D6FD46B2CF045FF1547', this.state.useItems,).send({from:account});
    
    //Loading
    //Txn Complete

    //if success txn
    //Ajax
    //Page 전환

    //fail txn 
    // ALERT AND NOT CHANGE
    console.log(sessionStorage);
  }



  render() {
    return (
        <div> 
        <b className="user-info">User Address: </b><div className="user-info" id="user-name" ></div>
        <b className="user-info" >Magnet: </b> <div className="user-info"  id="MagnetTokens" > </div>
        <b className="user-info">Magnet Field: </b><div className="user-info" id="MagnetFieldTokens"></div>
        <button className="user-info" onClick={this.updateInfo}> Refresh Info</button>
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
          <button id="start-btn" type="button" onClick={this.startGame}>GAME START</button>
          <button id="explain-btn" type="button" onClick={this.slideDown}>HOW TO PLAY</button>
        </div> 
        <br /><br /><br />
        <b>Buy Magnet: </b><input type="text" id="buyingTokens" placeholder="write integer only." /><button id="purchase-btn" onClick={this.purchaseMagnet} type="button">BUY</button>
      </div>
    );
  }
};



export default MainPage;