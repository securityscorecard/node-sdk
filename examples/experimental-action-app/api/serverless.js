const path = require("path");
const fastify = require("fastify");
const static = require("fastify-static");
const extractSSCHeaders = require("../utils/sscHelpers");

const server = fastify({
  logger: true,
});

server.get('/', async (request, reply) => reply.send("hi"));

server.post('/action', async (request, reply) => {
  try {
    const sscHeaders = extractSSCHeaders(request.headers);
    if (!sscHeaders.appSecrets) throw new UnauthorizedError('missing app secrets');
    // execute any event you desire, telegram message, slack notification, db update, etc.
    // console.log(sscHeaders);
    reply.send();
  } catch (error) {
    reply.send(error);
  }
});

server.register(static, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/public/',
});

const start = async () => await server.listen(3000);

start();