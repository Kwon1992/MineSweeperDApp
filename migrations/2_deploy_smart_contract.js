const Magnet = artifacts.require("Magnet");
const MagnetField = artifacts.require("MagnetField");
const GameController = artifacts.require("GameController");

module.exports = function(deployer) {
  deployer.deploy(Magnet);
  deployer.deploy(MagnetField);
  deployer.deploy(GameController);
};