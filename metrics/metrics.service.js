const { ServiceBroker } = require('moleculer');

const broker = new ServiceBroker();
broker.start();

broker.createService({
  name: 'metrics',

  actions: {
    welcome: {
      params: {
        name: 'string',
      },
      handler(ctx) {
        return `Welcome, ${ctx.params.name}`;
      },
    },
  },

  events: {},
  methods: {},
  created() {},
  started() {},
  stopped() {},
});

broker.repl();
