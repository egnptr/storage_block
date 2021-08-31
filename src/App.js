import React, { Component } from "react";
import { Switch, Route, Redirect } from "react-router-dom";
import Web3 from "web3";
import node from "./config";
import Storage from "./abis/Storage.json";
import Sidebar from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Files from "./pages/Files";
import Settings from "./pages/Settings";

const ipfsClient = require("ipfs-http-client");
const ipfs = ipfsClient({
  host: node[node.default].host,
  port: node[node.default].port,
  protocol: node[node.default].protocol,
});

class App extends Component {
  async componentDidMount() {
    await this.loadMetamask(this.props.dispatch);
  }

  async loadMetamask(dispatch) {
    if (typeof window.ethereum !== "undefined") {
      const web3 = new Web3(window.ethereum);
      const netId = await web3.eth.net.getId();
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      });

      //load balance
      if (typeof accounts[0] !== "undefined") {
        const balance = await web3.eth
          .getBalance(accounts[0])
          .then((result) => web3.utils.fromWei(result, "ether"));
        this.setState({ account: accounts[0], balance: balance, web3: web3 });
      } else {
        window.alert("Login with MetaMask");
      }

      //load contracts
      try {
        const storage = new web3.eth.Contract(
          Storage.abi,
          Storage.networks[netId].address
        );
        const filesCount = await storage.methods.totalFileCount().call();
        this.setState({
          storage: storage,
          filesCount: filesCount,
        });
        // Sort by the newest
        for (var i = filesCount - 1; i >= 0; i--) {
          const file = await storage.methods.files(i).call();
          this.setState({
            files: [...this.state.files, file],
          });
        }
      } catch (e) {
        console.log("Error", e);
        window.alert("Contracts are not deployed to the current network");
      }
    } else {
      window.alert("Please install MetaMask to use this Web App");
    }
  }

  handleUploadFile = (description) => {
    console.log("Submitting file to IPFS...");
    this.setState({ loading: true });
    ipfs.add(this.state.buffer, (error, result) => {
      console.log("Result : ", result);
      this.setState({ result: result[0] });
      if (error) {
        console.error(error);
        return;
      }
      if (this.state.type === "") {
        this.setState({ type: "none" });
      }
      this.state.storage.methods
        .uploadFile(
          result[0].hash,
          result[0].size,
          this.state.type,
          this.state.name,
          description
        )
        .send({ from: this.state.account })
        .on("transactionHash", (hash) => {
          this.setState({
            loading: false,
            type: null,
            name: null,
          });
          window.location.reload();
        })
        .on("error", (err) => {
          window.alert(JSON.stringify(err.message));
          this.setState({ loading: false });
        });
    });
  };

  handleUpdateFile = (e, fileId, description) => {
    e.preventDefault();
    console.log("Updating file...");
    this.setState({ loading: true });
    this.state.storage.methods
      .updateFile(fileId, description)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
        window.location.reload();
      })
      .on("error", (err) => {
        window.alert(JSON.stringify(err.message));
        this.setState({ loading: false });
      });
  };

  handleDeleteFile = (fileId, e) => {
    e.preventDefault();
    console.log("Deleting file...");
    this.setState({ loading: true });
    this.state.storage.methods
      .deleteFile(fileId)
      .send({ from: this.state.account })
      .on("transactionHash", (hash) => {
        this.setState({ loading: false });
        window.location.reload();
      })
      .on("error", (err) => {
        window.alert(JSON.stringify(err.message));
        this.setState({ loading: false });
      });
  };

  handleFileSelect = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (e.dataTransfer != null) {
      var file = e.dataTransfer.files[0];
    } else {
      file = e.target.files[0];
    }
    const reader = new window.FileReader();
    reader.onloadend = () => {
      this.setState({
        buffer: Buffer(reader.result),
        type: file.type,
        name: file.name,
      });
      console.log(this.state.name, this.state.buffer);
    };
    reader.readAsArrayBuffer(file);
  };

  handleDragOver(e) {
    e.stopPropagation();
    e.preventDefault();
  }

  handleClearFile = (e) => {
    e.preventDefault();
    this.setState({
      type: null,
      name: null,
    });
  };

  constructor(props) {
    super(props);
    this.state = {
      web3: "undefined",
      account: "",
      storage: null,
      balance: 0,
      files: [],
      loading: false,
      result: null,
      type: null,
      name: null,
    };
    this.handleUploadFile = this.handleUploadFile.bind(this);
    this.handleUpdateFile = this.handleUpdateFile.bind(this);
    this.handleDeleteFile = this.handleDeleteFile.bind(this);
    this.handleFileSelect = this.handleFileSelect.bind(this);
    this.handleDragOver = this.handleDragOver.bind(this);
    this.handleClearFile = this.handleClearFile.bind(this);
  }

  render() {
    return (
      <>
        <Sidebar />
        <div className="md:ml-64">
          <Switch>
            <Route exact path="/">
              <Dashboard
                account={this.state.account}
                balance={this.state.balance}
              />
            </Route>
            <Route exact path="/upload">
              <Upload
                clearFile={this.handleClearFile}
                fileReader={this.handleFileSelect}
                dragOver={this.handleDragOver}
                uploadFile={this.handleUploadFile}
                name={this.state.name}
                result={this.state.result}
                loading={this.state.loading}
              />
            </Route>
            <Route exact path="/files">
              <Files
                updateFile={this.handleUpdateFile}
                deleteFile={this.handleDeleteFile}
                account={this.state.account}
                files={this.state.files}
                loading={this.state.loading}
              />
            </Route>
            <Route exact path="/settings">
              <Settings />
            </Route>
            <Redirect from="*" to="/" />
          </Switch>
        </div>
      </>
    );
  }
}

export default App;
