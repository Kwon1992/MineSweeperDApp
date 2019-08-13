pragma solidity ^0.5.0;

interface IMagnet {

    function exchangeTokens(uint256 amount, address user) external returns (bool);
    function buyTokens() external payable returns (bool);
    function payToGamePlay() external;
    function rewardTokens(bytes1 _difficulty, address user) external returns (bool);
}