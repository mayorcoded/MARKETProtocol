const MathLib = artifacts.require('./libraries/MathLib.sol');
const CollateralToken = artifacts.require('./tokens/CollateralToken.sol');
const MarketToken = artifacts.require('./tokens/MarketToken.sol');
const MarketContractOraclize = artifacts.require('./oraclize/MarketContractOraclize.sol');
const MarketCollateralPool = artifacts.require('./MarketCollateralPool.sol');
const MarketContractRegistry = artifacts.require('./MarketContractRegistry.sol');

module.exports = function(deployer, network) {
  if (network !== 'live') {
    deployer.deploy([MathLib, MarketContractRegistry]).then(function() {
      deployer.link(MathLib, [MarketContractOraclize, MarketCollateralPool]);

      return deployer.deploy(MarketCollateralPool, MarketContractRegistry.address).then(function() {
        var gasLimit = web3.eth.getBlock('latest').gasLimit;
        return MarketCollateralPool.deployed().then(function() {
          return deployer
            .deploy(CollateralToken, 'CollateralToken', 'CTK', 10000, 18, {
              gas: gasLimit,
              from: web3.eth.accounts[0]
            })
            .then(function() {
              return deployer.deploy(MarketToken, 0, 0); // deploy just for testing.
            });
        });
      });
    });
  }
};
