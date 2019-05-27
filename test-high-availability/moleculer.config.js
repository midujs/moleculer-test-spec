module.exports = {
  nodeID: 'node-' + new Date().getTime(),
  serializer: 'JSON',
  transporter: 'nats://localhost:4222',

  requestTimeout: 0,

  retryPolicy: {
    enabled: true,
    retries: 5,
    delay: 100,
    maxDelay: 2000,
    factor: 2,
    check: err => err && !!err.retryable,
  },

  maxCallLevel: 100,
  heartbeatInterval: 3,
  heartbeatTimeout: 15,

  tracking: {
    enabled: false,
    shutdownTimeout: 5000,
  },

  disableBalancer: false,

  registry: {
    strategy: 'RoundRobin',
    preferLocal: true,
  },

  circuitBreaker: {
    enabled: false,
    threshold: 0.5,
    windowTime: 60,
    minRequestCount: 20,
    halfOpenTime: 10 * 1000,
    check: err => err && err.code >= 500,
  },

  bulkhead: {
    enabled: false,
    concurrency: 10,
    maxQueueSize: 100,
  },

  validation: true,
  validator: null,

  internalServices: true,
  internalMiddlewares: true,

  hotReload: false,

  // Register custom middlewares
  middlewares: [],

  // Called after broker created.
  created(broker) {},

  // Called after broker starte.
  started(broker) {},

  // Called after broker stopped.
  stopped(broker) {},

  replCommands: null,
};
