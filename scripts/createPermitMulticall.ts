import { ethers } from "hardhat";
import { SimpleERC20, MultiTransactor } from "../typechain-types";

async function main() {

  const alicePrivateKey = "0x2d73c8763a929d66e4dac344721aac7d81aa24a22bb2b7c4e7a94aee7565751b";

  const alice = new ethers.Wallet(alicePrivateKey, ethers.provider);
  const network = await ethers.provider.getNetwork();

  const targetERC20 = "0x8b0601343c7DFd7C0782134011100179DeAf39B2";
  const targetMultiTransactor = "0x36d4175F37c7baFBb65FfcC5f3696EC0f16272e8";
  const transferRecipient = "0x9eaD03F7136Fc6b4bDb0780B00a1c14aE5A8B6d0";

  const permitAmount = ethers.parseEther("1"); // 1 token
  const deadline = 2758989824

  const erc20Contract = await ethers.getContractFactory("SimpleERC20");
  const erc20Instance = erc20Contract.attach(targetERC20) as SimpleERC20;
  const aliceNonce = await erc20Instance.nonces(alice.address);

  console.log("Alice address:", alice.address);
  console.log("Alice nonce:", aliceNonce.toString());
  console.log("Permit amount:", ethers.formatEther(permitAmount));

  //
  // Prepare multicall data
  //
  const EIP712Domain = {
    name: "SimpleERC20", // token name from contract
    version: "1",
    chainId: network.chainId,
    verifyingContract: targetERC20,
  };
  const PermitType = {
    Permit: [
      { name: "owner", type: "address" },
      { name: "spender", type: "address" },
      { name: "value", type: "uint256" },
      { name: "nonce", type: "uint256" },
      { name: "deadline", type: "uint256" },
    ]
  };
  const permitValue = {
    owner: alice.address,
    spender: targetMultiTransactor,
    value: permitAmount,
    nonce: aliceNonce,
    deadline: deadline,
  };
  console.log("Permit struct:", permitValue);
  const permitSignature = await alice.signTypedData(EIP712Domain, PermitType, permitValue);
  const sig = ethers.Signature.from(permitSignature);
  console.log("Permit signature:", permitSignature);
  console.log("v:", sig.v, "r:", sig.r, "s:", sig.s);
  const permitCalldata = erc20Instance.interface.encodeFunctionData("permit", [
    alice.address,
    targetMultiTransactor,
    permitAmount,
    deadline,
    sig.v,
    sig.r,
    sig.s
  ]);
  const transferAmount = ethers.parseEther("1");
  const transferCalldata = erc20Instance.interface.encodeFunctionData("transferFrom", [
    alice.address,
    transferRecipient,
    transferAmount
  ]);

  console.log("Permit calldata:", permitCalldata);
  console.log("Transfer calldata:", transferCalldata);

  //
  // Execute multicall
  //
  const multiTransactorFactory = await ethers.getContractFactory("MultiTransactor");
  const multiTransactor = multiTransactorFactory.attach(targetMultiTransactor) as MultiTransactor;
  console.log("Executing multicall...");
  const tx = await multiTransactor.sendTxBatch(
    [targetERC20, targetERC20],
    [permitCalldata, transferCalldata],
    { gasLimit: 500000 }
  );

  console.log("Transaction hash:", tx.hash);

  const receipt = await tx.wait();
  console.log("Transaction confirmed in block:", receipt?.blockNumber);

  //
  // Verify the results
  //
  const finalAllowance = await erc20Instance.allowance(alice.address, targetMultiTransactor);
  const recipientBalance = await erc20Instance.balanceOf(transferRecipient);

  console.log("Final allowance:", ethers.formatEther(finalAllowance));
  console.log("Recipient balance:", ethers.formatEther(recipientBalance));
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });