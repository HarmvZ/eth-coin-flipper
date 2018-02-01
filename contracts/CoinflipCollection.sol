pragma solidity ^0.4.2;


contract CoinflipCollection {
	mapping (address => Coinflip) coinflips;
	address[] public coinflipAddresses;

	function CoinflipCollection() public {
	}

	function getCoinflips() public view returns(address[]) {
		return coinflipAddresses;
	}
	// function getCoinflipAt(address _address) public view returns(Coinflip) {
	// 	return coinflips[_address];
	// }
	function countCoinflips() public view returns(uint) {
		return coinflipAddresses.length;
	}


	function add(address _address) public returns (bool) {
		coinflipAddresses.push(_address);
		return true;
	}
}