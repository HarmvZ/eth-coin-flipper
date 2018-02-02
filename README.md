# Ethereum Coin Flipper
## Introduction
Ethereum coin flipper is a decentralized app that enables 2 participants to perform a winner-takes-all pseudo-random coin flip. This is how it works:
1. A new instance of a coin flip contract is created
2. A participant (player 1) deposits a certain amount of ethereum to the contract
3. A second participant (player 2) can then accept the terms of the contract by depositing the same amount of ethereum to the contract
4. The virtual coin is flipped and the amount of ethereum in the smart contract is deposited to either player 1 or player 2 depending on the outcome.
## Installaion
1. Install Truffle globally
```
$ npm i -g truffle
```
2. Clone repository
```
$ git checkout https://github.com/HarmvZ/eth-coin-flipper.git
```
3. Fetch dependencies
```
$ npm i
```
4. Run Truffle development console
```
$ truffle develop
```
5. Compile and migrate contracts
```
> compile
> migrate

```
6. Start development server (run this in a new shell)
```
$ npm run start
```
7. Now you can use your browser and MetaMask to start flipping coins on http://localhost:3000
## Demo
TODO
## Donate
Yes, please!