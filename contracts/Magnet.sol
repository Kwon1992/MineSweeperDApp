pragma solidity ^0.5.2;

import 'node_modules/openzeppelin-solidity/contracts/token/ERC20/ERC20.sol';

contract Magnet is ERC20{
    // ERC20 functions are implemeted by parent contract(ERC20 by Openzeppelin)

    // constant variables
    uint256 constant internal INITIAL_SUPPLY = 200000000; //(2억)
    uint8 constant internal GAME_COST = 10;

    // token information variables
    address public owner;
    address public controller;
    string public name;
    string public symbol;
    uint256 public decimals;
    uint256 private _suppliableAmount;
    uint256 private tokenPrice;

    constructor(address _owner) {
        owner = _owner;
        controller = msg.sender;
        name = "Magnet";
        symbol = "MG";
        decimals = 8;
        _totalSupply = INITIAL_SUPPLY ** 10 ** uint(decimals);
        _suppliableAmount = INITIAL_SUPPLY ** 10 ** uint(decimals);
        tokenPrice = 100000000000000; // 0.0001ETH = 1 MAGNET
    }

    // modifier definition
    modifier onlyOwner() {
        require(msg.sender == owner || msg.sender == controller);
        _;
    }



    // Events are implemented in IERC20.sol 
    /*
        event Transfer(address indexed from, address indexed to, uint256 value);
        event Approval(address indexed owner, address indexed spender, uint256 value);
    */
    // ERC20 standard functions
    function totalSupply() public view returns (uint256) {
        super();
    }

    function balanceOf(address account) public view returns (uint256) {
        super();
    }

    function transfer(address recipient, uint256 amount) public onlyOwner returns (bool) {
        super(recipient, amount);
    }

    function allowance(address owner, address spender) public view returns (uint256) {
        super(owner, spender);
    }

    function approve(address spender, uint256 value) public onlyOwner returns (bool) {
        super(spender, value);
    }

    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        super(sender, recipent, amount);
    }


    // Non-standard functions by OpenZeppelin
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        super(spender, addedValue);
    }

 
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        super(spender, subtractedValue);
    }

    function exchangeTokens(uint256 amount, address user) public onlyOwner returns (bool) {
        require(balances[user] >= amount && amount >= 10000);
        balances[user] -= amount;
        return true;
    }

    function buyTokens() payable public returns (bool) {
        uint tokensToBuy = msg.value / tokenPrice;
        require(balances[msg.sender] + tokensToBuy >= balances[msg.sender]); // watch for overflow
        require(_suppliableAmount >= tokensToBuy); // check suppliable token amounts
        balances[msg.sender] += tokensToBuy;
        totalTokens -= tokensToBuy;
    }

    function payToGamePlay() public {
        require(balances[user] >= GAME_COST);
        balances[user] -= GAME_COST;
        _suppliableAmount += GAME_COST;
    }

    function rewardTokens(bytes1 difficulty, address user) public onlyOwner returns (bool) {
        // 비율 모름...
    }
}