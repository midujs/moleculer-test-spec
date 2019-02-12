const PromService = require('moleculer-prometheus');

module.exports = {
  mixins: [PromService],
  settings: {
    port: 3030,
    collectDefaultMetrics: true,
    timeout: 5 * 1000,
  },
};
