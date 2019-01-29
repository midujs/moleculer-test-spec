const style = require('chalk');
const { GraphQLGateway, createGraphqlMixin } = require('@midujs/moleculer-graphql');
const { ServiceBroker } = require('moleculer');
const bConf = require('./moleculer.config');

const hLog = (...args) => style.green.bold(...args);

const sA = {
  name: 'sA',

  mixins: [
    createGraphqlMixin({
      typeName: 'sA',
      schema: `
        type Query {
          helloWorld: String
        }`,
      resolvers: {
        // helloWorld() {
        //   return 'Hello world.';
        // },
      },
    }),
  ],

  /**
   * Events
   */
  events: {},

  /**
   * Service started lifecycle event handler
   */
  started() {},

  /**
   * Service stopped lifecycle event handler
   */
  stopped() {},
};

// const broker = new ServiceBroker(bConf);
// broker.createService({ ...sA, name: 'sA-clone' });
// broker.start();

module.exports = sA;
