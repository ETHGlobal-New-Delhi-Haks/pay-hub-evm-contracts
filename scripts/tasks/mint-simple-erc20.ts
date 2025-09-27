import { task } from "hardhat/config";

import { SimpleERC20 } from "../../typechain-types/contracts/SimpleERC20";

task("task:mint-simple-erc20", "Mints SimpleERC20 token")
  .addParam("targetContract")
  .addParam("targetWallet")
  .addParam("amount")
  .addFlag("sendTransaction")
  .setAction(async (taskArgs, hre) => {
    const targetContract = taskArgs.targetContract || "0x0000000000000000000000000000000000000000";
    const targetWallet = taskArgs.targetWallet || "0x0000000000000000000000000000000000000000";
    const amount = taskArgs.amount || "0x0000000000000000000000000000000000000000";

    const sendTransaction = taskArgs.sendTransaction || false;

    const SimpleERC20Factory = await hre.ethers.getContractFactory("SimpleERC20");
    const SimpleERC20 = (await SimpleERC20Factory.attach(targetContract)) as SimpleERC20;

    const signer = (await hre.ethers.getSigners())[0];

    if (sendTransaction) {

      const tx = await SimpleERC20.connect(signer).mint(
        targetWallet,
        amount,
      );
      console.log("tx:", tx, "\n");
      const receipt = await tx.wait()
      console.log("receipt:", receipt, "\n");
    } else {
      const gas = await SimpleERC20.connect(signer).estimateGas.mint(targetWallet, amount);
      console.log("success, gas:", gas, "\n");
    }
  });