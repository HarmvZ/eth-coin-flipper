import React, { Component } from 'react'
import getWeb3 from './utils/getWeb3'
import Flipper from './Flipper'

import './css/oswald.css'
import './css/open-sans.css'
import './css/pure-min.css'
import './App.css'

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
    }
  }

  componentWillMount() {
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