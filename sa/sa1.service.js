const style = require('chalk');

module.exports = {
  name: 'sA1',

  /**
   * Service settings
   */
  settings: {
    typeName: 'sA1',
    hasGraphQLSchema: true,
  },

  /**
   * Service dependencies
   */
  //dependencies: [],

  /**
   * Actions
   */
  actions: {
    /**
     * Say a 'Hello'
     *
     * @returns
     */
    async hello(ctx) {
      await ctx.call('sA2.hello');
      await ctx.call('sA3.hello');
      return 'Hello Moleculer';
    },

    /**
     * Welcome a username
     *
     * @param {String} name - User name
     */
    welcome: {
      params: {
        name: 'string',
      },
      handler(ctx) {
        return `Welcome, ${ctx.params.name}`;
      },
    },
  },

  /**
   * Events
   */
  events: {},

  /**
   * Methods
   */
  methods: {},

  /**
   * Service created lifecycle event handler
   */
  created() {},

  /**
   * Service started lifecycle event handler
   */
  started() {},

  /**
   * Service stopped lifecycle event handler
   */
  stopped() {},
};
