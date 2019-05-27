const express = require('express');
const { ServiceBroker } = require('moleculer');

const config = require('../moleculer.config');
const broker = new ServiceBroker({ ...config, internalServices: true });
const logger = broker.getLogger('api');

const app = express();
const port = 3000;

app.get('/api/debug', async (req, res) => {
  try {
    logger.info(req.originalUrl);
    res.send(await broker.call('debug.summary'));
  } catch (err) {
    logger.info(req.originalUrl, 'API_ERROR');
    res.status(500);
    res.send('API_ERROR');
  }
});

app.listen(port, async () => {
  await broker.start();
  console.log(await broker.call('$node.services'));
  console.log('Express app running on port', port);
});
