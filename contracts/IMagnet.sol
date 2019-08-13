pragma solidity ^0.5.0;

interface IMagnet {
    function exchangeTokens(uint256 amount, address user) external returns (bool);
    function buyTokens(uint256 tokensToBuy, address user) external returns (bool);
    function payToGamePlay(address user) external;
    function rewardTokens(bytes2 _difficulty, address user) external returns (bool);
}