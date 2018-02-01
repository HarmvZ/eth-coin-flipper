import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import CoinflipCollectionContract from '../build/contracts/CoinflipCollection.json'
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
          count
        });
      });
    });
  }

  render() {
    return (
      <div className="App">
        <nav className="navbar pure-menu pure-menu-horizontal">
            <a href="#" className="pure-menu-heading pure-menu-link">EthCoinFlipper</a>
        </nav>

        <main className="container">
          <div className="pure-g">
            <Flipper />
          </div>
        </main>
      </div>
    );
  }
}

export default App