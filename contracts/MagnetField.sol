pragma solidity ^0.5.0;

import './IERC20.sol';
import './IMagnetField.sol';
import "./SafeMath.sol";

// 1 Manget == 100 MagnetField
contract MagnetField is IERC20, IMagnetField{
    using SafeMath for uint256;
    // ERC20 functions are implemeted by parent contract(ERC20 by Openzeppelin)

    // constant variables
    uint256 constant internal INITIAL_SUPPLY = 200000000; //(2억)

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

    /**
     * @dev 컨트랙트 생성시 자동으로 실행되는 일회성 생성자.
     * @param _owner 상위 컨트랙트(GameController)를 생성한 deployer.
     */
    constructor(address _owner) public{
        owner = _owner;
        controller = msg.sender;
        name = "MagnetField";
        symbol = "MGF";
        decimals = 8;
        totalSupply = INITIAL_SUPPLY ** 10 ** uint(decimals);
        suppliableAmount = INITIAL_SUPPLY ** 10 ** uint(decimals);
    }

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
     */
    function exchangeTokens(uint256 amount, address user) public onlyOwner returns (bool) {
        require(balances[user] >= amount, "Not enough Balance");
        require(amount >= 10000, "Not Reach Minimal Condition: 10000 MFT");
        balances[user] -= amount;
        suppliableAmount += amount;
        return true;
    }

    /**
     * @dev 교환 요청을 받은 경우 동작하는 함수.
     * @param cost 아이템을 구매하는데 사용한 총 토큰량
     * @param user 아이템 구매를 요청한 user
     */
    function buyItems(uint256 cost, address user) public {
        require(balances[user] >= cost, "Not enough Balance");
        balances[user] -= cost;
        suppliableAmount += cost;
    }

    /**
     * @dev 게임 결과에 따른 보상을 해주기 위한 함수
     * @param _difficulty user가 수행한 게임의 난이도
     * @param user 보상을 주어야하는 user
     */
    function rewardTokens(bytes1 _difficulty, address user) public onlyOwner returns (bool) {
        if(_difficulty == "EZ" && checkAmounts(700)) {
            balances[msg.sender] += 700;
            suppliableAmount -= 700;
        } else if (_difficulty == "NM" && checkAmounts(1000)) {
            balances[msg.sender] += 1000;
            suppliableAmount -= 1000;
        } else if (_difficulty == "HD" && checkAmounts(2000)) {
            balances[msg.sender] += 2000;
            suppliableAmount -= 2000;
        }
    }

    /**
     * @dev 특정량의 토큰을 공급가능한지(suppliableAmount), 또한 user의 balance에서 overflow가 발생하지 않는지 확인
     * @param _amount 체크하고 싶은 토큰량
     */
    function checkAmounts(uint256 _amount) internal returns (bool){
        require(suppliableAmount >= _amount, "Not enough Suppliable Tokens");
        require(balances[msg.sender] + _amount >= balances[msg.sender], "Overflow Occured");
        return true;
    }
}