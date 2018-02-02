pragma solidity ^0.4.2;


contract Coinflip {
	enum WagerState {noWager, wagerMade, wagerAccepted, wagerWon}
	WagerState public currentState;
	uint public wager;
	address public player1;
	address public player2;
	address public winner;
	uint public seedBlockNumber;

	modifier onlyState(WagerState expectedState) {
		if (expectedState == currentState) {
			_;
		} else {
			revert();
		}
	}

	function Coinflip() public {
		currentState = WagerState.noWager;
	}

	function getCurrentState() public view returns(WagerState) {
		return currentState;
	}
	function getWager() public view returns(uint) {
		return wager;
	}
	function getPlayer1() public view returns(address) {
		return player1;
	}
	function getPlayer2() public view returns(address) {
		return player2;
	}
	function getWinner() public view returns(address) {
		return winner;
	}


	function makeWager() onlyState(WagerState.noWager) public payable returns (bool) {
		wager = msg.value;
		player1 = msg.sender;
		currentState = WagerState.wagerMade;
		return true;
	}

	function acceptWager() onlyState(WagerState.wagerMade) public payable returns (bool) {
		require(msg.value == wager);
		require(player1 != msg.sender);
		player2 = msg.sender;
		seedBlockNumber = block.number;
		currentState = WagerState.wagerAccepted;
		return true;
	}

	function resolveBet() onlyState(WagerState.wagerAccepted) public returns (bool) {
        uint256 blockValue = uint256(block.blockhash(seedBlockNumber));
        uint256 factor = 57896044618658097711785492504343953926634992332820282019728792003956564819968;
        uint256 coinFlip = uint256(uint256(blockValue) / factor);
        
        if(coinFlip == 0) {
        	winner = player1;
            player1.transfer(this.balance);
        } else {
        	winner = player2;
            player2.transfer(this.balance);
        }
        currentState = WagerState.wagerWon;
        return true;
	}
}