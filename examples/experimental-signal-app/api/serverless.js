const path = require("path");
const fastify = require("fastify");
const static = require("fastify-static");
const extractSSCHeaders = require("../utils/sscHelpers");
const { SSC } = require('@securityscorecard/sdk');

const server = fastify({
  logger: true,
});

const TOKEN = 'YOUR_TOKEN';

const ssc = SSC({ token: TOKEN, host: 'https://platform-api.securityscorecard.tech' });

server.get('/', async (request, reply) => reply.send("hi"));

// this is an event that could be dispatched by a custom event, 
// for the sole purpose of the example, it will be propagated using a post event
server.post('/signal', async(request, reply) => {
  try {
    const signalResponse = await ssc.apps.sendSignals('signal_app.sample_information', [
      { domain: 'example.com', summary: 'test signal using sdk' }]);
    reply.send(signalResponse);
  } catch (error) {
    reply.send(error);
  }
});

server.get('/more-info', async (request, reply) => reply.send("detailed signal info"));

server.register(static, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/public/',
});

const start = async () => await server.listen(3000);

start();