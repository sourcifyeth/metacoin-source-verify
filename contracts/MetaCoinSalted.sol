pragma solidity >=0.4.25 <0.7.0;

import "./ConvertLib.sol";

// This is just a simple example of a coin-like contract.
// It is not standards compatible and cannot be expected to talk to other
// coin/token contracts. If you want to create a standards-compliant
// token, see: https://github.com/ConsenSys/Tokens. Cheers!

contract MetaCoinSalted is ConvertLib {
    mapping(address => uint) balances;

    event Transfer(address indexed _from, address indexed _to, uint256 _value);

    constructor() public {
        balances[tx.origin] = 10000;
    }

    function sendCoin(
        address receiver,
        uint amount
    ) public returns (bool sufficient) {
        if (balances[msg.sender] < amount) return false;
        balances[msg.sender] -= amount;
        balances[receiver] += amount;
        emit Transfer(msg.sender, receiver, amount);
        return true;
    }

    function getBalanceInEth(address addr) public view returns (uint) {
        return ConvertLib.convert(getBalance(addr), 2);
    }

    function getBalance(address addr) public view returns (uint) {
        return balances[addr];
    }
}

// Salt
/* 2023-07-12T07:27:53.738Z */
/* 2025-03-05T14:30:14.315Z */
/* 2025-03-05T14:36:42.880Z */
/* 2025-03-05T14:42:15.634Z */
/* 2025-03-06T08:31:28.755Z */
/* 2025-03-17T07:00:07.018Z */
/* 2025-03-17T07:01:05.143Z */
