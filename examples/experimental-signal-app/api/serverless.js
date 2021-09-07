const path = require("path");
const fastify = require("fastify");
const static = require("fastify-static");
const extractSSCHeaders = require("../utils/sscHelpers");
const { SSC } = require('@securityscorecard/sdk');

const server = fastify({
  logger: true,
});

const ssc = SSC({ token: '6TyzV3lNS6vFwcFgMuuTqods2Fnb', host: 'https://platform-api.securityscorecard.tech' });

server.get('/', async (request, reply) => reply.send("hi"));

server.post('/signal', async(request, reply) => {
  try {
    const signalResponse = ssc.apps.sendSignals('signal_app.sample_information', [
      { domain: 'cristiandley.com', summary: 'test signal using sdk' }])
    .then( signalsResponse => console.log('Signals emmited, check the response for failures', signalsResponse));
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