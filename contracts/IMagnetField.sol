pragma solidity ^0.5.0;

interface IMagnetField {
    function exchangeTokens(uint256 amount, address user) external returns (bool);
    function buyItems(uint256 cost, address user) external;
    function rewardTokens(bytes2 _difficulty, address user) external returns (bool);
}