// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "./AccountAbstraction.sol";
import "@openzeppelin/contracts/utils/Create2.sol";

contract AccountFactory {
    IEntryPoint public immutable entryPoint;
    address public immutable accountImplementation;
    
    event AccountCreated(address indexed account, address indexed owner, uint256 salt);
    
    constructor(IEntryPoint _entryPoint) {
        entryPoint = _entryPoint;
        accountImplementation = address(new SimpleAccount(_entryPoint));
    }
    
    function createAccount(address owner, uint256 salt) external returns (address) {
        address account = getAddress(owner, salt);
        
        if (account.code.length > 0) {
            return account;
        }
        
        bytes memory bytecode = abi.encodePacked(
            type(SimpleAccount).creationCode,
            abi.encode(entryPoint)
        );
        
        account = Create2.deploy(0, bytes32(salt), bytecode);
        SimpleAccount(payable(account)).initialize(owner);
        
        emit AccountCreated(account, owner, salt);
        return account;
    }
    
    function getAddress(address owner, uint256 salt) public view returns (address) {
        bytes memory bytecode = abi.encodePacked(
            type(SimpleAccount).creationCode,
            abi.encode(entryPoint)
        );
        
        return Create2.computeAddress(bytes32(salt), keccak256(bytecode));
    }
}