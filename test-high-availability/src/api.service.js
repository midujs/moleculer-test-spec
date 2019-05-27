const ApiGateway = require('moleculer-web');

module.exports = {
  name: 'api',
  mixins: [ApiGateway],
  settings: {
    routes: [
      {
        path: '/api',
        aliases: {
          debug: 'debug.summary',
        },
      },
    ],
  },
};
