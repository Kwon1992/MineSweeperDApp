pragma solidity ^0.5.0;

import './Magnet.sol';
import './MagnetField.sol';

// ganache-cli -l 8000000
contract GameController {

    // variables
    address[2] private tokensAddr;
    address payable public owner;

    mapping (bytes32 => UserInfo) public users;

    // user DB structure
    struct GameLog { // use for game log!
        bytes32 gameHex; // use for transparency. (when start the game, )
        bytes2 difficulty; // EZ, NM, HD - necessary?
        bool isRewarded;
        GameResult result; //default : LOSE ***WIN/LOSE/ 2 (NOT FOUND)
        bool[3] useItem; //default: false(SHIELD), false(FirstCell), false(ShowMap)
    }

    struct UserInfo {
        address gamerID; // User account address
        uint256 totalGameCount;  // to tracking recent gameResult.
        bool isPlaying; // check progress of the game
        mapping (uint256 => GameLog) logs; // start from 0 to N.... (game result log)
    }

    constructor() public {
        owner = msg.sender;
        tokensAddr[0] = address(new Magnet(msg.sender));
        tokensAddr[1] = address(new MagnetField(msg.sender));
    }



    // constants
    uint8 constant internal BET_TOKEN_AMOUNT = 10;
    uint256 constant internal LEAST_EXCHANGE_AMOUNT = 10000;

    enum ItemLists { Shield, FirstCell, ShowMap } // check item uselist...
    enum GameResult { WIN, LOSE, NOT_FOUND } // 0: WIN, 1: LOSE

    // Event Lists

    // when users start the game
    event START(bytes2 difficulty, bytes32 gameHex, bool[3] useItem, uint256 totalGameCount); //BombHex -> keccak256(bombCoords)
    // when the game is over.
    event WIN();    event LOSE();    event REGISTER();

    function buyMagnet() public payable returns (bool) {
        uint256 amount = msg.value / Magnet(tokensAddr[0]).getTokenPrice();
        Magnet(tokensAddr[0]).buyTokens(amount, msg.sender);
    }


    // 1Magnet = 0.001ETH 1000
    function sellMagnet(uint sellAmount) public payable returns (bool) {
        bytes32 userIdentificator = keccak256(abi.encodePacked(msg.sender));
        address seller = users[userIdentificator].gamerID;
        uint256 getETH = (sellAmount * 1000000000000000);

        if(Magnet(tokensAddr[0]).sellTokens(sellAmount, msg.sender)) { // true
        // ETH 주기
            require(address(this).balance > getETH, "Not enough ETH in contracts... Plz contact to Deployer");
            require(seller != address(0x0) && seller == msg.sender, "Seller - Buyer Not Match");
            msg.sender.transfer(getETH);
            return true;
        } else {
            return false;
        }
    }


    function buyMagnetField() public payable returns (bool) {
        MagnetField(tokensAddr[1]).getTokens(100000, msg.sender);
    }

    function getMagnetBalance() public view returns (uint256) {
        return Magnet(tokensAddr[0]).balanceOf(msg.sender);
    }

    function getMagnetFieldBalance() public view returns (uint256) {
        return MagnetField(tokensAddr[1]).balanceOf(msg.sender);
    }
    /**
     * @dev 게임 시작 전 만약 처음 게임을 하는 유저라면 게임DB에 유저정보를 등록한다.
     * @param _userIdentificator userInfo Map의 key (keccak256 결과값)

     */
    function register(bytes32 _userIdentificator) private {
        UserInfo storage user = users[_userIdentificator];

        user.gamerID = msg.sender;
        user.totalGameCount = 0;
        user.isPlaying = false;

        emit REGISTER();
    }

    /**
     * @dev 게임 시작 전 아이템 사용 여부에 따라 MagnetField 토큰을 감소시킨다.
     * @param _useItems 각 아이템에 대한 선택 여부 정보를 가진 parameter
     * @return 정상적으로 수행된 경우 true값을 반환한다.
     */
    function useItems(bool[3] memory _useItems) public returns (uint256){ // internal로 바꿀 예정
        uint256 totalItemCost = 0;
        if(_useItems[0]) totalItemCost += 10000;
        if(_useItems[1]) totalItemCost += 20000;
        if(_useItems[2]) totalItemCost += 30000;
        if(totalItemCost != 0) {
            MagnetField(tokensAddr[1]).buyItems(totalItemCost, msg.sender);
        }
        return totalItemCost;
    }
    /**
     * @dev 게임 시작 시 실행되는 함수로써 유저정보 최신화 및 게임로그 기록을 한 후 START 이벤트를 발생시킨다.
     * @param _difficulty 게임의 난이도를 front-end에서 받아온다.
     * @param _gameCost 게임 시작에 사용한 Magnet 토큰 양을 front-end에서 받아온다.
     * @param _gameHex 게임의 transparency를 위한 sha256 value를 front-end에서 받아온다.
     * @param _gameCost 게임 시작에 사용한 Magnet 토큰 양을 front-end에서 받아온다.
     */
    function startGame(bytes2 _difficulty, uint8 _gameCost, bytes32  _gameHex, bool[3] memory _useItem) public{
        bytes32 userIdentificator = keccak256(abi.encodePacked(msg.sender));
        UserInfo storage user = users[userIdentificator];

        require(_gameCost == BET_TOKEN_AMOUNT, "You Does not bet 10 Magnet Tokens"); // Is gameCost same as the BET_TOKEN_AMOUNT
        require(Magnet(tokensAddr[0]).balanceOf(msg.sender) >= BET_TOKEN_AMOUNT, "Not Enough Magnet Tokens"); // check Magnet balance of Users.
        if(user.gamerID == address(0)) { // No User Data (Newbie)
            register(userIdentificator);
        }

        //double check user existence
        require(user.gamerID != address(0), "No User Data : startGame");
        // change isPlaying flag and update totalGameCount
        user.isPlaying = true;
        user.totalGameCount += 1;

        // write game log
        GameLog storage log = user.logs[user.totalGameCount];
        log.difficulty = _difficulty;
        log.result = GameResult.LOSE;
        log.isRewarded = false;
        log.gameHex = _gameHex;

        for (uint i = 0 ; i < 3; i++) {
            log.useItem[i] = _useItem[i];
        }

        // decrease MagnetField (if use items)
        useItems(log.useItem);

        // substract 10 Magnet Tokens
        Magnet(tokensAddr[0]).payToGamePlay(msg.sender);
        emit START(_difficulty, _gameHex, _useItem, user.totalGameCount);
    }


    /**
     * @dev 게임 종료 시 실행되는 함수로써 게임 결과를 업데이트 한 후 LOSE 이벤트를 발생시킨다..
     * @param _gameHex 기존 게임 로그와의 비교를 통해 조작 여부를 확인한다.
     * @param _isWinner 게임 승리 여부를 확인하기 위한 bool parameter
     */
    function endGame(bytes32 _gameHex, bool _isWinner, address userAddr) public {
        bytes32 userIdentificator = keccak256(abi.encodePacked(userAddr));
        UserInfo storage user = users[userIdentificator];
        GameLog storage log = user.logs[user.totalGameCount];

        // check user is in contract's database.
        require(user.gamerID != address(0), "No User Data: endGame");
        require(user.totalGameCount != 0, "No Game History");

        // _gameHex recheck(compare with log's hex value :: RECENT GAME!!)
        require(log.gameHex == _gameHex, "No such Game in logs: endGame");
        require(log.isRewarded != true, "Already Rewarded Game: endGame");

        //update game result. and reward to users depending on the result of final game.
       // ture : WIN, false : LOSE [get values from front-end game]
       if(_isWinner){
            log.result = GameResult.WIN;
        } else {
            log.result = GameResult.LOSE;
        }

        if(rewardUser(log.difficulty, _isWinner, userAddr)) {
            log.isRewarded = true;
        }
    }

    /**
     * @dev 유저의 게임결과에 따라 보상을 지급한다
     * @param  _difficulty 게임 난이도
     * @param  _isWinner 게임 성공여부
     * @return 성공적으로 함수가 실행된 경우 true를 반환한다.
     */
    function rewardUser(bytes2 _difficulty, bool _isWinner, address userAddr) internal returns (bool) {
        if(_isWinner) {
            require(Magnet(tokensAddr[0]).rewardTokens(_difficulty, userAddr), "Revert from Magnet : rewardUser");
            require(MagnetField(tokensAddr[1]).rewardTokens(_difficulty, userAddr, _isWinner), "Revert from MagnetF : rewardUser");
            emit WIN();
        } else {
            require(MagnetField(tokensAddr[1]).rewardTokens(_difficulty, userAddr, _isWinner), "Revert from MagnetF : rewardUser");
            emit LOSE();
        }
        return true;
    }

    /**
     * @dev 특정 유저의 총 게임 횟수를 반환한다.
     * @return 특정 유저의 총 게임 횟수.
     */
    function getTotalGameCount() public view returns (uint256) {
        UserInfo memory user = users[keccak256(abi.encodePacked(msg.sender))];
        return user.totalGameCount;
    }
    /**
     * @dev 유저의 특정(index) 게임 결과를 보여준다.
     *      Solidity 특성 상 mapping을 전체 순회할 수 없기때문에 index를 활용한다.
     *      for loop는 front-end에서 돌면서 확인할 수 있도록 한다.
     *      getTotalGameCount()를 이용해 front-end에서 최근 게임번호를 저장한뒤 이를 활용해 for loop를 돈다면
     *      확인이 가능하다.
     * @param  index  알고싶은 게임번호
     * @return 최근 게임의 난이도와를 반환한다.
     */
    function getGameResults(uint256 index) public view returns (bytes2 difficulty, bytes32 gameHex, GameResult result) {
        if (users[keccak256(abi.encodePacked(msg.sender))].gamerID == address(0) ||
            users[keccak256(abi.encodePacked(msg.sender))].totalGameCount < index) {
            difficulty = bytes2("NA");
            result = GameResult.NOT_FOUND;
        } else {
            UserInfo storage user = users[keccak256(abi.encodePacked(msg.sender))];
            GameLog storage log = user.logs[index];

            difficulty = log.difficulty;
            gameHex = log.gameHex;
            result = log.result;
        }

    }

    /**
     * @dev MagnetField 토큰을 Magnet 토큰으로 교환시켜주도록 요청한다.
     * @param  _amount 교환하고자 하는 Magnet 토큰 량
     * @return 정상적으로 transaction이 이루어진 경우 true를 반환한다.
     */
     function exchangeTokens(uint256 _amount) public returns (bool) {
        require(MagnetField(tokensAddr[1]).exchangeTokens(_amount, msg.sender),"Revert from MagnetF : exchangeTokens"); // magnetField 토큰을 감소시킨다.
        require(Magnet(tokensAddr[0]).exchangeTokens(_amount, msg.sender), "Revert from Magnet : exchangeTokens"); // magnet 토큰을 증가시킨다.
        return true;
     }

    /*
     *struct UserInfo {
     * address payable gamerID; // User account address
     * uint256 totalGameCount;  // to tracking recent GameResult.
     * mapping (uint256 => GameResult) results; // start from 0 to N.... (game result log)
     * bool isPlaying;
     *}
     */
     function getUserInfo() public view returns (address _gamerID, uint256 _totalGameCount) {
        UserInfo storage user = users[keccak256(abi.encodePacked(msg.sender))];
        _gamerID = user.gamerID;
        _totalGameCount = user.totalGameCount;
     }

    /**
     * @dev 현재 컨트랙트 상의 ETH 량을 보여준다.
     */
     function showETH() public view returns (uint256){
         return address(this).balance;
     }

    modifier onlyOwner() {
        require(msg.sender == owner , "Unauthorized sender : Magnet");
        _;
    }

    /**
     * @dev deployer에게 컨트랙트가 보유한 전체 ETH를 지급한다.
     */
     function withdrawETHALL() public onlyOwner {
         owner.transfer(address(this).balance);
     }
}