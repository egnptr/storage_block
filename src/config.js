const config = {
  port: 5001,
  gateway: 8080,
};

let node = {
  // remote node
  default: "remote",
  remote: {
    host: "ipfs.infura.io",
    ...config,
    protocol: "https",
  },

  // local node
  local: {
    host: "127.0.0.1",
    ...config,
    protocol: "http",
  },
};

export const setDefault = (val) => (node.default = val);

export default node;
