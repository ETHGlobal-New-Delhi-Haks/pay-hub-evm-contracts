// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.13;

// solhint-disable no-empty-blocks, func-name-mixedcase

import "@openzeppelin/contracts/metatx/MinimalForwarder.sol";

contract Relayer is MinimalForwarder {
    uint256 public diff = 0x01;  // for difference bytecode
}