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
        require(msg.sender == owner || msg.sender == controller, "Unauthorized sender");
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
    // function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
    //     super(spender, addedValue);
    // }

 
    // function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
    //     super(spender, subtractedValue);
    // }

    function exchangeTokens(uint256 amount, address user) public onlyOwner returns (bool) {
        require(balances[user] >= amount, "Not enough Balance");
        require(amount >= 10000, "Not Reach Minimal Condition: 10000 MFT");
        balances[user] -= amount;
        return true;
    }

    function buyTokens() payable public returns (bool) {
        uint tokensToBuy = msg.value / tokenPrice;
        require(balances[msg.sender] + tokensToBuy >= balances[msg.sender], "OverFlow Occured"); // watch for overflow
        require(_suppliableAmount >= tokensToBuy, "Not enough Suppliable Tokens"); // check suppliable token amounts
        balances[msg.sender] += tokensToBuy;
        totalTokens -= tokensToBuy;
        return true;
    }

    function payToGamePlay() public {
        require(balances[user] >= GAME_COST, "Not enough Balance");
        balances[user] -= GAME_COST;
        _suppliableAmount += GAME_COST;
    }

    function rewardTokens(bytes1 difficulty, address user) public onlyOwner returns (bool) {
        if(_difficulty == "EZ" && checkAmounts(7)) {
            balances[msg.sender] += 7;
        } else if (_difficulty == "NM" && checkAmounts(10)) {
            balances[msg.sender] += 10;
        } else if (_difficulty == "HD" && checkAmounts(20)) {
            balances[msg.sender] += 20;
        } else {
            console.log("NOT AVAILABLE DIFFICULTY");
        }
    }

    function checkAmounts(uint256 _amount) internal {
        require(_suppliableAmount >= _amount, "Not enough Suppliable Tokens");
        require(balance[msg.sender] + _amount >= balances[msg.sender], "Overflow Occured");
        return true;
    }
}