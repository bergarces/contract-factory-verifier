//SPDX-License-Identifier: Unlicense
pragma solidity ^0.8.0;

import "./Greeter.sol";

contract GreeterFactory {
    event GreeterDeployed(address indexed greeter, address indexed deployer, string indexed greeting);

    function deployGreeter(string memory _greeting) public {
        Greeter greeter = new Greeter(_greeting);
        emit GreeterDeployed(address(greeter), msg.sender, _greeting);
    }
}
