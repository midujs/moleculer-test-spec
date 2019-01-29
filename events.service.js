const style = require('chalk');
const { GraphQLGateway, createGraphqlMixin } = require('@midujs/moleculer-graphql');
const { ServiceBroker } = require('moleculer');
const bConf = require('./moleculer.config');

const hLog = (...args) => style.green.bold(...args);

const events = {
  name: 'events',
  events: {
    '$services.changed'() {
      this.logger.info(
        hLog('[$services.changed][this.broker.services]'),
        this.broker.services.map(service => service.name),
      );
    },
    async '$node.connected'({ node }) {
      const logger = this.broker.logger;

      if (!node) {
        return;
      }

      logger.info(hLog('[$node.connected][broker.services]'), this.broker.services.map(service => service.name));
      logger.info(hLog('[$node.connected][node.services]'), node.services.map(s => s.name));

      const res = await this.broker.call('$node.services');
      logger.info(hLog('[$node.connected]["$node.services"]'), res.map(service => service.name));
    },
  },
  started() {},
  stopped() {},
};

module.exports = events;
