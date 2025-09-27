import { ethers } from "hardhat";

async function main() {

  const signers = await ethers.getSigners();
  const network = await ethers.provider.getNetwork();
  const targetRelayer = "0xb512F1B21ce69C820cc96eBf58da1eE7bf57FDeb";
  const targetContract = "0x8b0601343c7DFd7C0782134011100179DeAf39B2";
  const targetValue = "0";
  const targetGas = "1000000";
  const targetNonce = (await (await ethers.getContractFactory("Relayer")).attach(targetRelayer).nonces(signers[0].address)).toString();
  const targetData = (await ethers.getContractFactory("SimpleERC20")).interface.encodeFunctionData("transfer", ["0x00baBAE949C80Ad8547C010FDBb87cD3223077a4", ethers.parseEther("100")]);

  const EIP712Domain = {
    name: "Relayer",
    chainId: network.chainId,
    verifyingContract: targetRelayer,
    version: '1',
  }

  const ForwardRequest = {
    ForwardRequest : [
      { name: 'from', type: 'address' },
      { name: 'to', type: 'address' },
      { name: 'value', type: 'uint256' },
      { name: 'gas', type: 'uint256' },
      { name: 'nonce', type: 'uint256' },
      { name: 'deadline', type: 'uint48' },
      { name: 'data', type: 'bytes' },
    ]
  }

  const value = {
    from: signers[0].address,
    to: targetContract,
    value: targetValue,
    gas: targetGas,
    nonce: targetNonce,
    deadline: 2758989824,
    data: targetData,
  }

  console.log("value struct:", value);

  const signature = await signers[0].signTypedData(EIP712Domain, ForwardRequest, value);

  console.log("signature:", signature);

  console.log("trying to send transaction");

//   struct ForwardRequestData {
//     address from;
//     address to;
//     uint256 value;
//     uint256 gas;
//     uint48 deadline;
//     bytes data;
//     bytes signature;
// }
  const ForwardRequestData = {
    from: value.from,
    to: value.to,
    value: value.value,
    gas: value.gas,
    deadline: value.deadline,
    data: value.data,
    signature: signature,
  }
  const tx = await (await ethers.getContractFactory("Relayer")).attach(targetRelayer).execute(ForwardRequestData, {gasLimit: targetGas});
  console.log("tx:", tx.hash);
  const receipt = await tx.wait();
  console.log("receipt:", receipt);

}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });