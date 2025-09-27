import { task } from "hardhat/config";

import { Contract } from "ethers";
import { SimpleERC20 } from "../../typechain-types/contracts/SimpleERC20";

task("task:deploy-simple-erc20", "Deploys SimpleERC20 smart contract")
  .addOptionalParam("initialOwner")
  .addOptionalParam("trustedForwarder")
  .addOptionalParam("proxyAddress")
  .setAction(async (taskArgs, hre) => {
    const initialOwner = taskArgs.initialOwner || "0x0000000000000000000000000000000000000000";
    const trustedForwarder = taskArgs.trustedForwarder || "0x0000000000000000000000000000000000000000";
    const proxyAddress = taskArgs.proxyAddress || "0x0000000000000000000000000000000000000000";

    const SimpleERC20Factory = await hre.ethers.getContractFactory("SimpleERC20");
    let simpleERC20: Contract;

    if (proxyAddress == "0x0000000000000000000000000000000000000000") {
      simpleERC20 = await hre.upgrades.deployProxy(SimpleERC20Factory, [initialOwner, trustedForwarder]);
      console.log("SimpleERC20 deployed to:", simpleERC20.target);
    } else if (proxyAddress == "0x0000000000000000000000000000000000000001") {
      const impl = await hre.upgrades.deployImplementation(SimpleERC20Factory);
      console.log("SimpleERC20 implementation", impl);
    } else {
      simpleERC20 = await hre.upgrades.upgradeProxy(proxyAddress, SimpleERC20Factory);
      console.log("SimpleERC20 upgraded", proxyAddress);
    }
  });