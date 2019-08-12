pragma solidity ^0.5.2;

import './Magnet.sol';
import './MagnetField.sol';

    // 맨 처음 게임을 시작하는 사람들 (즉, 정보가 입력되어있지 않은 사람들..에 대한 처리가 필요)
contract GameController {

    address[2] private tokensAddr;

    // user DB structure
    struct GameLog { // use for game log!
        bytes32 gameHex; // use for transparency. (when start the game, )
        bytes1 difficulty; // EZ, NM, HD - necessary? 
        GameResult result; //default : false ***true: win the game, false: lose the game 
        bool useItem; //default: false
    }

    struct UserInfo {
        address payable gamerID; // User account address
        uint256 totalGameCount;  // to tracking recent gameResult. 
        bool isPlaying; // check progress of the game
        mapping (uint256 => GameLog) logs; // start from 0 to N.... (game result log)
    }

    constructor() public {
        owner = msg.sender;
        tokensAddr[0] = address(new Magnet(msg.sender));
        tokensAddr[1] = address(new MagnetField(msg.sender));
    }
    

    // https://ethereum.stackexchange.com/questions/7713/how-does-mapping-work (참고.. mapping 동작 방식)

    // constants
    uint8 constant internal BET_TOKEN_AMOUNT = 10;
    uint256 constant internal LEAST_EXCHANGE_AMOUNT = 10000;



    // variables
    address payable public owner;
    mapping (bytes32 => userInfo) private users;
    
    enum ItemLists { Shield, FirstCell, ShowMap } // check item uselist...
    enum GameResult { WIN, LOSE } // 0: WIN, 1: LOSE
    
    // Event Lists

    // when users start the game
    event START(bytes1 difficulty, bytes32 gameHex, bool useItem, uint256 totalGameCount); //BombHex -> keccak256(bombCoords)  
    // when the game is over.
    event WIN();
    event LOSE();


    /**
     * @dev 게임 시작 전 만약 처음 게임을 하는 유저라면 게임DB에 유저정보를 등록한다.
     *struct UserInfo {
     * address payable gamerID; // User account address
     * uint256 totalGameCount;  // to tracking recent GameResult.
     * mapping (uint256 => GameResult) results; // start from 0 to N.... (game result log) 
     * bool isPlaying;
     *}
     */
    function register() internal {
        userIdentificator = keccak256(abi.encodePacked(msg.sender));
        users[userIdentificator].gamerId = msg.sender;
        users[userIdentificator].totalGameCount = 0;
        users[userIdentificator].isPlaying = false;
    }

    /**
     * @dev 게임 시작 시 실행되는 함수로써 유저정보 최신화 및 게임로그 기록을 한 후 START 이벤트를 발생시킨다.
     *struct UserInfo {
     * address payable gamerID; // User account address
     * uint256 totalGameCount;  // to tracking recent GameResult.
     * mapping (uint256 => GameResult) results; // start from 0 to N.... (game result log) 
     * bool isPlaying;
     *}
     *
     *
     *struct GameResult { // use for game log!
     * bytes32 gameHex; // use for transparency. (when start the game, )
     * bytes1 difficulty; // EZ, NM, HD - necessary? 
     * bool isWinner; //default : false ***true: win the game, false: lose the game 
     * bool useItem; //default: false
     *}
     * @param difficulty 게임의 난이도를 front-end에서 받아온다.
     * @param gameCost 게임 시작에 사용한 Magnet 토큰 양을 front-end에서 받아온다.
     */
    function startGame(bytes1 _difficulty, uint8 _gameCost, bytes32 _gameHex, bool _useItem) public {
        userIdentificator = keccak256(abi.encodePacked(msg.sender));
        UserInfo storage user = users[userIdentificator];

        require(_gameCost == BET_TOKEN_AMOUNT, "You Does not bet 10 Magnet Tokens"); // Is gameCost same as the BET_TOKEN_AMOUNT
        require(Magnet(tokensAddr[0]).balanceOf(msg.sender) >= BET_TOKEN_AMOUNT, "Not Enough Magnet Tokens"); // check Magnet balance of Users.
        
        if(user = 0x0) { // No User Data (Newbie)
            register();
        }

        require(user != 0x0, "No User Data");
        // change isplaying flag and update totalGameCount
        user.isPlaying = true;
        user.totalGameCount += 1;

        // write game log        
        GameLog log= user.logs[totalGameCount];
        log.gameHex = _gameHex;
        log.result = GameResult.LOSE;
        log.useItem = _useItem;

        // substract 10 Magnet Tokens
        Magnet(tokensAddr[0]).payToGamePlay();
        emit START(_difficulty, _gameHex, _useItem, user.totalGameCount);
    }

    /**
     * @dev 게임 종료 시 실행되는 함수로써 게임 결과를 업데이트 한 후 LOSE 이벤트를 발생시킨다..
     * @param _gameHex 기존 게임 로그와의 비교를 통해 조작 여부를 확인한다.
     * @param _isWinner 게임 승리 여부를 확인하기 위한 bool parameter 
     */
    function endGame(bytes32 _gameHex, bool _isWinner) { 
        require(user != 0x0, "No User Data");

        userIdentificator = keccak256(abi.encodePacked(msg.sender));
        UserInfo storage user = users[userIdentificator];
        GameLog log= user.logs[totalGameCount];
        // _gameHex recheck(compare with log's hex value)
        require(log.gameHex == _gameHex);

        //update game result. and reward to users depending on the result of final game.
        if(_isWinner) { // ture : WIN, false : LOSE
            log.result = GameResult.WIN;
            //보상 Magnet 과 MagnetField...
            emit WIN();
        } else {
            //보상 MagnetField만...
            log.result = GameResult.LOSE;
            emit LOSE();
        }
        

    }


    /**
     * @dev 특정 유저의 총 게임 횟수를 반환한다.
     * @return 특정 유저의 총 게임 횟수.  
     */
    function getTotalGameCount() internal view returns (uint256) {
        UserInfo memory user = users[keccak256(abi.encodePacked(msg.sender))];
        return user.totalGameCount;
    }

    /**
     * @dev 유저의 특정(index) 게임 결과를 보여준다. 
     *      Solidity 특성 상 mapping을 전체 순회할 수 없기때문에 index를 활용한다.
     *      for loop는 front-end에서 돌면서 확인할 수 있도록 한다.
     *      getTotalGameCount()를 이용해 front-end에서 최근 게임번호를 저장한뒤 이를 활용해 for loop를 돈다면
     *      확인이 가능하다.
     * @param index  알고싶은 게임번호 
     * @return 최근 게임의 난이도와를 반환한다.  
     */
    function getGameResults(uint256 index) internal view returns (bytes1 difficulty, uint result) { 
        if (users[keccak256(abi.encodePacked(msg.sender))] = 0) {
            return;
        }
        UserInfo memory user = users[keccak256(abi.encodePacked(msg.sender))];
        gameLog log = user.logs[index];
        difficulty = log.difficulty;
        result = uint(log.result);
    }

    /**
     * @dev MagnetField 토큰을 Magnet 토큰으로 교환시켜주도록 요청한다.
     * @return 정상적으로 transaction이 이루어진 경우 true를 반환한다.
     */
     function exchangeTokens() public returns (bool) {
        require(MagnetField(tokensAddr[1]).exchangeTokens(amount, msg.sender),"Not Enough MagnetField Balance"); // magnetField 토큰을 감소시킨다.
        require(Magnet(tokensAddr[0]).exchangeTokens(amount, msg.sender), "Not Able to exchange to Magnet"); // magnet 토큰을 증가시킨다.
        return true;
     }
}