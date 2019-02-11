module.exports = {
  namespace: 'test-spec',
  nodeID: 'node-' + new Date().getTime(),

  logger: true,
  metrics: true,
  sampleCount: 1,
  metricsRate: 1,
  logLevel: 'info',
  logFormatter: 'default',
  logObjectPrinter: null,

  // transporter: 'nats://localhost:4222',
  transporter: process.env.TRANSPORTER_URL || 'nats://localhost:4222',

  serializer: 'JSON',

  requestTimeout: 10 * 1000,
  retryPolicy: {
    enabled: false,
    retries: 5,
    delay: 100,
    maxDelay: 1000,
    factor: 2,
    check: err => err && !!err.retryable,
  },

  maxCallLevel: 100,
  heartbeatInterval: 5,
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
