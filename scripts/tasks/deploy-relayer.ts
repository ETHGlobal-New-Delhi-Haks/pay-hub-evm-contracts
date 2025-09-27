import { task } from "hardhat/config";

import { Contract } from "ethers";
import { Relayer } from "../../typechain-types/contracts/Relayer";

task("task:deploy-relayer", "Deploys Relayer smart contract")
  .setAction(async (taskArgs, hre) => {
    const RelayerFactory = await hre.ethers.getContractFactory("Relayer");
    const relayer: Contract = await RelayerFactory.deploy() as Relayer;

    await relayer.waitForDeployment();

    console.log("Relayer deployed to:", relayer.target);
  });