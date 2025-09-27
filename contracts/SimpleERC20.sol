// SPDX-License-Identifier: MIT
// Compatible with OpenZeppelin Contracts ^5.4.0
pragma solidity 0.8.20;

import {ERC20Upgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import {ERC20PermitUpgradeable} from "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PermitUpgradeable.sol";
import {Initializable} from "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import {OwnableUpgradeable} from "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import {ContextUpgradeable} from "@openzeppelin/contracts-upgradeable/utils/ContextUpgradeable.sol";
import {ERC2771ContextFixed} from "./ERC2771ContextFixed.sol";

contract SimpleERC20 is Initializable, ERC20Upgradeable, ERC20PermitUpgradeable, OwnableUpgradeable, ERC2771ContextFixed {
    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(address initialOwner, address trustedForwarder) public initializer {
        __ERC20_init("SimpleERC20", "SERC20");
        __ERC20Permit_init("SimpleERC20");
        __Ownable_init(initialOwner);
        _setTrustedForwarder(trustedForwarder);
    }

    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    function _msgSender() internal view virtual override(ERC2771ContextFixed, ContextUpgradeable) returns (address sender) {
        return(ERC2771ContextFixed._msgSender());
    }

    function _msgData() internal view virtual override(ERC2771ContextFixed, ContextUpgradeable) returns (bytes calldata) {
        return(ERC2771ContextFixed._msgData());
    }
}