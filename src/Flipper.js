import React, { Component } from 'react'
import CoinflipContract from '../build/contracts/Coinflip.json'
import getWeb3 from './utils/getWeb3'
import {BigNumber} from 'bignumber.js'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'


class Flipper extends Component {
  constructor(props) {
    super(props)

    this.state = {
      wagerState: null,
      wager: "1",
      player1: null,
      player2: null,
      wagerInstance: null,
      accounts: null,
      web3: null
    }

    this.handleInputChange = this.handleInputChange.bind(this);    
    this.makeWager = this.makeWager.bind(this);    
    this.acceptWager = this.acceptWager.bind(this);    
    this.resolveBet = this.resolveBet.bind(this);    
  }

  componentWillMount() {
    // Get network provider and web3 instance.
    // See utils/getWeb3 for more info.

    getWeb3
    .then(results => {
      this.setState({
        web3: results.web3
      })

      // Instantiate contract once web3 provided.
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const coinflip = contract(CoinflipContract)
    coinflip.setProvider(this.state.web3.currentProvider)

    // Declaring this for later
    let wagerInstance

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      //coinflip.at("0xb5e12f571780fa757b17c6a879481623f5d2d28fd35c05f957ed378e89a538c8").then((instance) => {
        // 0x0d8cc4b8d15d4c3ef1d70af0071376fb26b5669b
      coinflip.deployed().then((instance) => {
        wagerInstance = instance;
        this.setState({
          wagerInstance,
          accounts
        }, () => {
          this.fetchContractVars();
        })
      });
    })
  }

  fetchContractVars(){
    // Fetch all state variables
    this.state.wagerInstance.getCurrentState().then((wagerState) => {
      this.state.wagerInstance.getWager().then((wager) => {
        this.state.wagerInstance.getPlayer1().then((player1) => {
          this.state.wagerInstance.getPlayer2().then((player2) => {
            // Update state with the result.
            this.setState({ 
              wagerState: wagerState.c[0],
              wager: wager.s,
              player1,
              player2
            });
          });
        });
      });
    });
  }

  handleInputChange(event) {
    this.setState({wager: event.target.value});
  }

  eth2Wei(value) {
    let wei = this.state.web3.toWei(parseInt(value), 'ether');
    return wei;
  }

  makeWager() {
    if (this.state && this.state.wagerInstance) {
      let wager = this.eth2Wei(this.state.wager);
      this.state.wagerInstance.makeWager({
        from: this.state.accounts[0], 
        value: wager,
        gas: 80000
      }).then((result) => {
        if (result) {
          this.fetchContractVars();
        } else {
          console.error('error 1');
        }
      });
    }
  }

  acceptWager() {
    if (this.state && this.state.wagerInstance) {
      let wager = this.eth2Wei(this.state.wager);
      this.state.wagerInstance.acceptWager({
        from: this.state.accounts[0], 
        value: wager,
        gas: 80000
      }).then((result) => {
        if (result) {
          this.fetchContractVars();
        } else {
          console.error('error 2');
        }
      });
    }
  }

  resolveBet() {
    if (this.state && this.state.wagerInstance) {
      this.state.wagerInstance.resolveBet({
        from: this.state.accounts[0], 
        value: 0,
        gas: 80000
      }).then((result) => {
        if (result) {
          this.fetchContractVars();
        } else {
          console.error('error 3');
        }
      });
    }
  }

  render() {
    let statusTxt = 'Loading...';
    let wageBtn;
    switch (this.state.wagerState) {
      case null:
      case 0: 
        statusTxt = 'No wager';
        wageBtn = (
          <div>
            <input type="number" min="1" max="100" value={this.state.wager} onChange={this.handleInputChange} />
            <WageBtn onClickAction={this.makeWager} label="Make wager!" />
          </div>
        );
        break;
      case 1:
        statusTxt = 'Wager made';
        wageBtn = <WageBtn onClickAction={this.acceptWager} label="Accept Wager!" />;
        break;
      case 2:
        statusTxt = 'Wager accepted';
        wageBtn = <WageBtn onClickAction={this.resolveBet} label="Resolve Bet!" />;
        break;
    }
    let addr1 = this.state.player1;
    if (!this.state.player1 || this.state.player1 == "0x0000000000000000000000000000000000000000") {
      addr1 = "None set";
    }
    let addr2 = this.state.player2;
    if (!this.state.player2 || this.state.player2 == "0x0000000000000000000000000000000000000000") {
      addr2 = "None set";
    }

    return (
          <div className="pure-g">
            <div className="pure-u-1-1">
              <h1>Ethereum Coinflipper</h1>
              <p>Status: {statusTxt}</p>
              <p>Player 1: {addr1}</p>
              <p>Player 2: {addr2}</p>
            </div>
              {wageBtn}
            <div className="pure-u-1-1">
              <h2>Contract variables</h2>
              <p>The wager state is: {this.state.wagerState}</p>
              <p>The wager is: {this.state.wager}</p>
              <p>Player 1 is: {this.state.player1}</p>
              <p>Player 2 is: {this.state.player2}</p>
            </div>
          </div>
    );
  }
}

export default Flipper

class WageBtn extends Component {
  constructor(props) {
    super(props);
  }  

  render() {
    return (
      <div>
        <button className="btn btn-primary" onClick={this.props.onClickAction}>{this.props.label}</button>
      </div>
    );
  }
}