Storage Block is a decentralized file storing web application using IPFS and Ethereum blockchain. Unlike most solutions, Storage Block :

- Stores its file in IPFS, a protocol and peer-to-peer network for storing and sharing data in a distributed file system.
- Uses the smart contract functionality within Ethereum blockchain to store, edit, and delete information of file that are being uploaded to the application.
- Ensures all of the files that are stored are secure and cannot be tempered by other third-parties.

## Developing

Please make sure you meet the prerequisites:

- [Node.js](https://nodejs.org/en/download/) installed.
- A personal Ethereum blockchain using [Ganache](https://www.trufflesuite.com/ganache) installed.

## Running

To run the migrations to deploy contracts to the Ethereum network, run the following:

```
truffle migrate
```

In the project directory, you can run the app in the development mode with :

```
npm run start
```
