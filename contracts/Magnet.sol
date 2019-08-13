pragma solidity ^0.5.0;

import './IERC20.sol';
import './IMagnet.sol';
import "./SafeMath.sol";

// 1Magnet = 0.0001ETH

contract Magnet is IERC20, IMagnet{
    using SafeMath for uint256;
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
    uint256 private totalSupply;
    uint256 private suppliableAmount;
    uint256 private tokenPrice;

    mapping (address => uint256) private balances;
    mapping (address => mapping (address => uint256)) private allowances;

    constructor(address _owner) public {
        owner = _owner;
        controller = msg.sender;
        name = "Magnet";
        symbol = "MG";
        decimals = 8;
        totalSupply = INITIAL_SUPPLY * 10 ** uint(decimals);
        suppliableAmount = INITIAL_SUPPLY * 10 ** uint(decimals);
        tokenPrice = 100000000000000; // 0.0001ETH = 1 MAGNET
    }

    // modifier definition
    modifier onlyOwner() {
        require(msg.sender == owner || msg.sender == controller, "Unauthorized sender : Magnet");
        _;
    }



    // Events are implemented in IERC20.sol
    /*
        event Transfer(address indexed from, address indexed to, uint256 value);
        event Approval(address indexed owner, address indexed spender, uint256 value);
    */
    // ERC20 standard functions
    // Events are implemented in IERC20.sol
    /*
        event Transfer(address indexed from, address indexed to, uint256 value);
        event Approval(address indexed owner, address indexed spender, uint256 value);
    */
    // ERC20 standard functions
    /**
     * @dev See `IERC20.totalSupply`.
     */
    function getTotalSupply() public view returns (uint256) {
        return totalSupply;
    }

    /**
     * @dev See `IERC20.balanceOf`.
     */
    function balanceOf(address account) public view returns (uint256) {
        return balances[account];
    }

    /**
     * @dev See `IERC20.transfer`.
     *
     * Requirements:
     *
     * - `recipient` cannot be the zero address.
     * - the caller must have a balance of at least `amount`.
     */
    function transfer(address recipient, uint256 amount) public returns (bool) {
        _transfer(msg.sender, recipient, amount);
        return true;
    }

    /**
     * @dev See `IERC20.allowance`.
     */
    function allowance(address from, address to) public view returns (uint256) {
        return allowances[from][to];
    }

    /**
     * @dev See `IERC20.approve`.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function approve(address spender, uint256 value) public returns (bool) {
        _approve(msg.sender, spender, value);
        return true;
    }

    /**
     * @dev See `IERC20.transferFrom`.
     *
     * Emits an `Approval` event indicating the updated allowance. This is not
     * required by the EIP. See the note at the beginning of `ERC20`;
     *
     * Requirements:
     * - `sender` and `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `value`.
     * - the caller must have allowance for `sender`'s tokens of at least
     * `amount`.
     */
    function transferFrom(address sender, address recipient, uint256 amount) public returns (bool) {
        _transfer(sender, recipient, amount);
        _approve(sender, msg.sender, allowances[sender][msg.sender].sub(amount));
        return true;
    }

    /**
     * @dev Atomically increases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to `approve` that can be used as a mitigation for
     * problems described in `IERC20.approve`.
     *
     * Emits an `Approval` event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     */
    function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
        _approve(msg.sender, spender, allowances[msg.sender][spender].add(addedValue));
        return true;
    }

    /**
     * @dev Atomically decreases the allowance granted to `spender` by the caller.
     *
     * This is an alternative to `approve` that can be used as a mitigation for
     * problems described in `IERC20.approve`.
     *
     * Emits an `Approval` event indicating the updated allowance.
     *
     * Requirements:
     *
     * - `spender` cannot be the zero address.
     * - `spender` must have allowance for the caller of at least
     * `subtractedValue`.
     */
    function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
        _approve(msg.sender, spender, allowances[msg.sender][spender].sub(subtractedValue));
        return true;
    }

    /**
     * @dev Moves tokens `amount` from `sender` to `recipient`.
     *
     * This is internal function is equivalent to `transfer`, and can be used to
     * e.g. implement automatic token fees, slashing mechanisms, etc.
     *
     * Emits a `Transfer` event.
     *
     * Requirements:
     *
     * - `sender` cannot be the zero address.
     * - `recipient` cannot be the zero address.
     * - `sender` must have a balance of at least `amount`.
     */
    function _transfer(address sender, address recipient, uint256 amount) internal {
        require(sender != address(0), "ERC20: transfer from the zero address");
        require(recipient != address(0), "ERC20: transfer to the zero address");

        balances[sender] = balances[sender].sub(amount);
        balances[recipient] = balances[recipient].add(amount);
        emit Transfer(sender, recipient, amount);
    }

    /** @dev Creates `amount` tokens and assigns them to `account`, increasing
     * the total supply.
     *
     * Emits a `Transfer` event with `from` set to the zero address.
     *
     * Requirements
     *
     * - `to` cannot be the zero address.
     */
    function _mint(address account, uint256 amount) internal {
        require(account != address(0), "ERC20: mint to the zero address");

        totalSupply = totalSupply.add(amount);
        balances[account] = balances[account].add(amount);
        emit Transfer(address(0), account, amount);
    }

     /**
     * @dev Destoys `amount` tokens from `account`, reducing the
     * total supply.
     *
     * Emits a `Transfer` event with `to` set to the zero address.
     *
     * Requirements
     *
     * - `account` cannot be the zero address.
     * - `account` must have at least `amount` tokens.
     */
    function _burn(address account, uint256 value) internal {
        require(account != address(0), "ERC20: burn from the zero address");

        totalSupply = totalSupply.sub(value);
        balances[account] = balances[account].sub(value);
        emit Transfer(account, address(0), value);
    }

    /**
     * @dev Sets `amount` as the allowance of `spender` over the `owner`s tokens.
     *
     * This is internal function is equivalent to `approve`, and can be used to
     * e.g. set automatic allowances for certain subsystems, etc.
     *
     * Emits an `Approval` event.
     *
     * Requirements:
     *
     * - `owner` cannot be the zero address.
     * - `spender` cannot be the zero address.
     */
    function _approve(address from, address to, uint256 value) internal {
        require(from != address(0), "ERC20: approve from the zero address");
        require(to != address(0), "ERC20: approve to the zero address");

        allowances[from][to] = value;
        emit Approval(from, to, value);
    }

    /**
     * @dev Destoys `amount` tokens from `account`.`amount` is then deducted
     * from the caller's allowance.
     *
     * See `_burn` and `_approve`.
     */
    function _burnFrom(address account, uint256 amount) internal {
        _burn(account, amount);
        _approve(account, msg.sender, allowances[account][msg.sender].sub(amount));
    }



    // Non-standard functions by OpenZeppelin
    // function increaseAllowance(address spender, uint256 addedValue) public returns (bool) {
    //     super(spender, addedValue);
    // }


    // function decreaseAllowance(address spender, uint256 subtractedValue) public returns (bool) {
    //     super(spender, subtractedValue);
    // }

    /**
     * @dev 교환 요청을 받은 경우 동작하는 함수.
     * @param amount 교환하고자 하는 magnetfield 양
     * @param user 교환을 요청한 user
     * @return 정상적으로 함수 동작 시 true 반환
     */
    function exchangeTokens(uint256 amount, address user) public onlyOwner returns (bool) {
        require(balances[user] >= amount, "Not enough Balance");
        require(amount >= 10000, "Not Reach Minimal Condition: 10000 MFT");
        balances[user] -= amount;
        return true;
    }


    function getTokenPrice() public view returns (uint256) {
        return tokenPrice;
    }

    /**
     * @dev 교환 요청을 받은 경우 동작하는 함수.
     * @return 정상적으로 함수 동작 시 true 반환
     */
    function buyTokens(uint tokensToBuy, address user) public onlyOwner returns (bool) {
        require(balances[user] + tokensToBuy >= balances[msg.sender], "OverFlow Occured"); // watch for overflow
        require(suppliableAmount >= tokensToBuy, "Not enough Suppliable Tokens"); // check suppliable token amounts
        balances[user] += tokensToBuy;
        suppliableAmount -= tokensToBuy;
        return true;
    }

    /**
     * @dev 게임 시작 전 시작 비용을 내기 위한 함수
     */
    function payToGamePlay(address user) public {
        require(balances[user] >= GAME_COST, "Not enough Balance");
        balances[user] -= GAME_COST;
        suppliableAmount += GAME_COST;
    }

    /**
     * @dev 게임 결과에 따른 보상을 해주기 위한 함수
     * @param _difficulty user가 수행한 게임의 난이도
     * @param user 보상을 주어야하는 user
     */
    function rewardTokens(bytes2 _difficulty, address user) public onlyOwner returns (bool) {
        if(_difficulty == bytes2("EZ") && checkAmounts(7)) {
            balances[user] += 7;
        } else if (_difficulty == bytes2("NM") && checkAmounts(10)) {
            balances[user] += 10;
        } else if (_difficulty == bytes2("HD") && checkAmounts(20)) {
            balances[user] += 20;
        }

        return true;
    }

    /**
     * @dev 특정량의 토큰을 공급가능한지(suppliableAmount), 또한 user의 balance에서 overflow가 발생하지 않는지 확인
     * @param _amount 체크하고 싶은 토큰량
     */
    function checkAmounts(uint256 _amount) internal view returns (bool){
        require(suppliableAmount >= _amount, "Not enough Suppliable Tokens");
        require(balances[msg.sender] + _amount >= balances[msg.sender], "Overflow Occured");
        return true;
    }
}