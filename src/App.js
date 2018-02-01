import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import CoinflipCollectionContract from '../build/contracts/CoinflipCollection.json'
import CoinflipContract from '../build/contracts/Coinflip.json'
import Flipper from './Flipper'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      web3: null,
      collectionInstance: null,
      accounts: null,
      collection: null,
      count: null,
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
      this.instantiateContract()
    })
    .catch(() => {
      console.log('Error finding web3.')
    })    
  }

  instantiateContract() {
    const contract = require('truffle-contract')
    const coinflipCollection = contract(CoinflipCollectionContract)
    coinflipCollection.setProvider(this.state.web3.currentProvider)



    // Declaring this for later so we can set it in e.
    let collectionInstance
    let collectionCount;
    let collection;

    // Get accounts.
    this.state.web3.eth.getAccounts((error, accounts) => {
      coinflipCollection.deployed().then((instance) => {
        collectionInstance = instance;
        this.setState({
          collectionInstance,
          accounts
        }, () => {
          this.fetchContractVars();
        })
      });
    })
  }

  fetchContractVars(){
    // Fetch all state variables
    this.state.collectionInstance.getCoinflips().then((collection) => {
      this.state.collectionInstance.countCoinflips().then((count) => {
        // Update state with the result.
        this.setState({ 
          collection,
          count: count.c[0]
        });
      });
    });
  }

  addCoinflip() {
    const contract = require('truffle-contract')
    const coinflip = contract(CoinflipContract)
    coinflip.setProvider(this.state.web3.currentProvider)

    coinflip.new({
      from: this.state.accounts[0],
      gas: 5000000
    }).then(instance => {
      this.state.collectionInstance.add(instance.address, {from: this.state.accounts[0]}).then(result =>{
        if(result) {
          console.log('New coin instance created and added to collection.');
          this.render();
        }
      })
    }).catch(err => {
      console.error(err);
    })
  }

  render() {
    let flippers = [this.state.count];
    for (let i = 0; i < this.state.count; i++) {
      flippers[i] = <Flipper address={this.state.collection[i]} key={i} />
    }

    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">EthCoinFlipper</a>
        </nav>

        <main className="container">
          <h1>Ethereum Coinflipper</h1>
          <button className="pure-button pure-button-primary" onClick={this.addCoinflip}>Add new instance</button>
          <div className="pure-g">
            {flippers}
          </div>
        </main>
      </div>
    );
  }
}

export default App


/*
  Replacing Migrations...
  ... 0x52b7cb51c8585bd0ccfdacebb75f485d0cd9b27beb90c89443b6641bc54bb092
  Migrations: 0x2eca6fcfef74e2c8d03fbaf0ff6712314c9bd58b
Saving successful migration to network...
  ... 0xbbfff7e113df2cc189ea653249c45ce5c8199deed19e30a57b0dcdac820e6c75
Saving artifacts...
Running migration: 2_deploy_collection_contract.js
  Deploying CoinflipCollection...
  ... 0x6be10866d6288a02fc6ca5176e452ffdb2ea8a727fc1af0ff4be39af040b9cbb
  CoinflipCollection: 0xf328c11c4df88d18fcbd30ad38d8b4714f4b33bf
Saving successful migration to network...
  ... 0x2661c19ed981808f1e9d86a0af8659df782cf763539206c93f3f1ca6dd60694d
Saving artifacts...
Running migration: 3_deploy_contracts.js
  Replacing Coinflip...
  ... 0xb4e5f7eb0955b604831b0d37fadf2841fd617c04294f06ca627fce573b8c40ba
  Coinflip: 0xb9b7e0cb2edf5ea031c8b297a5a1fa20379b6a0a
Saving successful migration to network...
  ... 0x075de1ebbb1a0e68b405e13fd0acbc9f9231607aecb5d255b51a478b3680998d
Saving artifacts...
*/