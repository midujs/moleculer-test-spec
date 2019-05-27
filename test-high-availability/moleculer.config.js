module.exports = {
  nodeID: 'node-' + new Date().getTime(),
  transporter: 'nats://localhost:4222',

  registry: {
    strategy: 'Random',
  },

  // requestTimeout: 0.5 * 1000,

  // retryPolicy: {
  //   enabled: false,
  //   retries: 5,
  //   delay: 100,
  //   maxDelay: 2000,
  //   factor: 2,
  //   check: err => err && !!err.retryable,
  // },

  // internalServices: false,
};
