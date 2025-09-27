// SPDX-License-Identifier: BUSL-1.1
// GameFi Core™ by CDEVS

pragma solidity 0.8.20;
// solhint-disable avoid-low-level-calls

contract MultiTransactor {

    function sendTx(address to, bytes memory data) external returns (bytes memory) {
        (bool success, bytes memory result) = to.call(data);
        require(success, "MultiTransactor: call failed");

        return result;
    }

    function sendTxBatch(address[] calldata to, bytes[] calldata data)
        external
        returns (bytes[] memory)
    {
        require(to.length == data.length, "MultiTransactor: to.length != data.length");
        bytes[] memory results = new bytes[](data.length);

        for (uint256 i = 0; i < to.length; i++) {
            (bool success, bytes memory result) = to[i].call(data[i]);
            require(success, "MultiTransactor: call failed");
            results[i] = result;
        }

        return results;
    }

}