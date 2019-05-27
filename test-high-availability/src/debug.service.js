const uuid = require('uuid/v1');

const insId = uuid().split('-')[0];
const summary = { count: 0 };

module.exports = {
  name: 'debug',
  actions: {
    summary() {
      summary.count = summary.count + 1;
      this.logger.info(insId, summary);
      return { time: new Date().getTime() };
    },
  },
};
