import React, { Component } from 'react'
import CoinflipContract from '../build/contracts/Coinflip.json'
import getWeb3 from './utils/getWeb3'
import {BigNumber} from 'bignumber.js'

class Flipper extends Component {
  constructor(props) {
    super(props)

    this.state = {
      wagerState: null,
      wager: "",
      player1: null,
      player2: null,
      wagerInstance: null,
      accounts: null,
      web3: null,
      showDetails: false
    }

    this.handleInputChange = this.handleInputChange.bind(this);    
    this.makeWager = this.makeWager.bind(this);    
    this.acceptWager = this.acceptWager.bind(this);    
    this.resolveBet = this.resolveBet.bind(this);    
    this.toggleDetails = this.toggleDetails.bind(this);    
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
      coinflip.at(this.props.address).then((instance) => {
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
        gas: 150000
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
        gas: 150000
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
        gas: 150000
      }).then((result) => {
        if (result) {
          this.fetchContractVars();
        } else {
          console.error('error 3');
        }
      });
    }
  }

  toggleDetails() {
    this.setState(prevState => {
      return {showDetails: !prevState.showDetails};
    });
  }  

  render() {
    //Switch over wagerState and add relevant elements
    let statusTxt = 'Loading...';
    let wageBtn;
    let contractData = [];
    const player1El = <p key="player1"><span className="bold">Player 1:</span> {this.state.player1}</p>;
    const player2El = <p key="player2"><span className="bold">Player 2:</span> {this.state.player2}</p>;
    const wagerEl = <p key="wager"><span className="bold">Wager:</span> {this.state.wager} Ether</p>;
    switch (this.state.wagerState) {
      case null:
      case 0: 
        statusTxt = 'No wager';
        wageBtn = (          
            <fieldset>
              <div className="mdl-textfield mdl-js-textfield mdl-textfield--floating-label">
                <input className="mdl-textfield__input" type="number" pattern="[0-9]*(\.[0-9]+)?" id="wager" value={this.state.wager} onChange={this.handleInputChange} />
                <label className="mdl-textfield__label" htmlFor="wager">Wager (Eth)</label>
                <span className="mdl-textfield__error">Input is not a number!</span>
              </div>              
              <WageBtn onClickAction={this.makeWager} label="Make wager!" />
            </fieldset>
        );
        break;
      case 1:
        statusTxt = 'Wager made';
        wageBtn = <WageBtn onClickAction={this.acceptWager} label="Accept Wager!" />;
        contractData.push(player1El, wagerEl);
        break;
      case 2:
        statusTxt = 'Wager accepted';
        wageBtn = <WageBtn onClickAction={this.resolveBet} label="Flip the coin!" />;
        contractData.push(player1El, player2El, wagerEl);
        break;
      default:
        // No button
        break;
    }
    contractData.unshift(<p key="status"><span className="bold">Status:</span> {statusTxt}</p>);

    // Toggle details
    let detailBtnText = this.state.showDetails ? 'Hide details' : 'Show details...';
    let details;
    if (this.state.showDetails) {
      details = (
          <table className="mdl-data-table mdl-shadow--2dp">
            <thead>
              <tr>
                <th>Variable</th>
                <th>Value</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>wagerState</td>
                <td>{this.state.wagerState}</td>
              </tr>
              <tr>
                <td>wager</td>
                <td>{this.state.wager}</td>
              </tr>
              <tr>
                <td>player1</td>
                <td>{this.state.player1}</td>
              </tr>
              <tr>
                <td>player2</td>
                <td>{this.state.player2}</td>
              </tr>
            </tbody>
          </table>
      );
    }

    return (
      <div className="mdl-cell mdl-cell--6-col mdl-cell--8-col-tablet">
        <div className="mdl-card mdl-shadow--2dp coinflip-card">
          <div className="mdl-card__title">
            <p className="mdl-card__title-text label">Coinflip contract</p>
            <h2 className="mdl-card__title-text subtitle">{this.props.address}</h2>
          </div>
          <div className="mdl-card__supporting-text contract-data">
            {contractData}
          </div>
          <div className="mdl-card__actions mdl-card--border">
            <form action="#" className="coinflip-form">              
              {wageBtn}
              <fieldset>
                <button type="button" onClick={this.toggleDetails} className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect">{detailBtnText}</button>
              </fieldset>
            </form>
          </div>
          <div className="padded-table">
            {details}
          </div>            
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
        <button type="button" className="mdl-button mdl-js-button mdl-button--raised mdl-js-ripple-effect mdl-button--accent" onClick={this.props.onClickAction}>{this.props.label}</button>
    );
  }
}