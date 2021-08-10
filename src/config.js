const config = {
  port: 5001,
  gateway: 8080,
};

const node = {
  // remote node
  default: "remote",
  remote: {
    host: "ipfs.infura.io",
    ...config,
    protocol: "https",
  },

  // local node
  location: {
    host: "127.0.0.1",
    ...config,
    protocol: "http",
  },
};

export default node;
