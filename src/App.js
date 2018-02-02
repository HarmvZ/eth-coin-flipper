import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import CoinflipCollectionContract from '../build/contracts/CoinflipCollection.json'
import CoinflipContract from '../build/contracts/Coinflip.json'
import Flipper from './Flipper'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      collectionInstance: null,
      accounts: null,
      collection: null,
      count: null,
      timerId: null,
    }

    this.addCoinflip = this.addCoinflip.bind(this);
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
      this.instantiateContract(() => {
        const timerId = setInterval(() => {
          this.fetchContractVars();
        }, 5000);
        this.setState({
          timerId,
        });
      });
    })
    .catch(() => {
      console.log('Error finding web3.')
    })    
  }


  componentWillUnmount() {
    clearInterval(this.state.timerId);
  }  

  instantiateContract(callback) {
    const contract = require('truffle-contract')
    const coinflipCollection = contract(CoinflipCollectionContract)
    coinflipCollection.setProvider(this.state.web3.currentProvider)



    // Declaring this for later so we can set it in e.
    let collectionInstance
    let collectionCount;
    let collection;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      coinflipCollection.at('0xe84bf6DB0b2a52E55325B1fFd341D18D17446717').then((instance) => {
        collectionInstance = instance;
        this.setState({
          collectionInstance,
          accounts
        }, () => {
          this.fetchContractVars(callback);
        })
      });
    })
  }

  fetchContractVars(callback){
    // Fetch all state variables
    this.state.collectionInstance.getCoinflips().then((collection) => {
      this.state.collectionInstance.countCoinflips().then((count) => {
        // Update state with the result.
        this.setState({ 
          collection,
          count: count.c[0]
        }, () => {
          if (callback) {
            callback();
          }
        });
      });
    });
  }

  addCoinflip() {
    this.state.collectionInstance.addNew({from: this.state.accounts[0]}).then(address => {
      if(address) {
        console.log('New coin instance created and added to collection.');
        this.render();
      }
    }).catch(err => {
      console.error(err);
    })
  }

  render() {
    // intro text
    // const markdown = require( "markdown" ).markdown;
    // let introText = markdown.toHtml(require('./README.md'));

    let flippers = [this.state.count];
    for (let i = 0; i < this.state.count; i++) {
      flippers[i] = <Flipper address={this.state.collection[i]} key={i} />
    }

    return (
      <div className="App">
        <div className="coinflip-layout-transparent mdl-layout mdl-js-layout">
          <main className="mdl-layout__content">
            <div className="page-content max-width-content">
              <div className="mdl-grid">
                <div className="mdl-cell mdl-cell--12-col mdl-cell--8-col-tablet">
                  <div className="mdl-card mdl-shadow--2dp welcome-card">
                    <div className="mdl-card__title  mdl-card--border">
                      <h2 className="mdl-card__title-text">Ethereum Coinflipper</h2>
                    </div>
                    <div className="mdl-card__supporting-text mdl-card--border">
                      <p>Flip a coin and win some ethereum from another player!</p>                 
                    </div>
                    <div className="mdl-card__supporting-text mdl-card--border how-it-works">
                      <h3>How it works</h3>
                      <p>Ethereum coin flipper is a decentralized app that enables 2 participants to perform a winner-takes-all pseudo-random coin flip. This is how it works:</p>
                      <ol>
                        <li>A new instance of a coin flip contract is created</li>
                        <li>A participant (player 1) deposits a certain amount of ethereum to the contract</li>
                        <li>A second participant (player 2) can then accept the terms of the contract by depositing the same amount of ethereum to the contract</li>
                        <li>The virtual coin is flipped and the amount of ethereum in the smart contract is deposited to either player 1 or player 2 depending on the outcome.</li>
                      </ol> 
                      </div>
                  </div>
                </div>
                {flippers}
              </div>
            </div>
            <button className="add-contract mdl-button mdl-js-button mdl-button--fab mdl-js-ripple-effect mdl-button--colored" onClick={this.addCoinflip}>
              <i className="material-icons">add</i>
            </button> 
          </main>
        </div> 
      </div>
    );
  }
}

export default App