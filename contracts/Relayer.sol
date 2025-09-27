// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.20;

// solhint-disable no-empty-blocks, func-name-mixedcase

import "@openzeppelin/contracts/metatx/ERC2771Forwarder.sol";

contract Relayer is ERC2771Forwarder {

    constructor() ERC2771Forwarder("Relayer") {}

    uint256 public diff = 0x01;  // for difference bytecode
}