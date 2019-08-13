const GameController = artifacts.require("GameController");

module.exports = function(deployer) {
  deployer.deploy(GameController);
};