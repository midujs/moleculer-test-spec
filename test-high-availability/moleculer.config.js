module.exports = {
  nodeID: 'node-' + new Date().getTime(),
  transporter: 'nats://localhost:4222',
  retryPolicy: {
    enabled: true,
    retries: 5,
    delay: 100,
    maxDelay: 2000,
    factor: 2,
    check: err => err && !!err.retryable,
  },
};
