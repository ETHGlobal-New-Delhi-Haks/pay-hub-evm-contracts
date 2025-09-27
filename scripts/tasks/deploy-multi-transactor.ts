import { task } from "hardhat/config";

import { Contract } from "ethers";
import { MultiTransactor } from "../../typechain-types/contracts/MultiTransactor";

task("task:deploy-multi-transactor", "Deploys MultiTransactor smart contract")
  .setAction(async (taskArgs, hre) => {
    const MultiTransactorFactory = await hre.ethers.getContractFactory("MultiTransactor");
    const multiTransactor: Contract = await MultiTransactorFactory.deploy() as MultiTransactor;

    await multiTransactor.waitForDeployment();

    console.log("MultiTransactor deployed to:", multiTransactor.target);
  });