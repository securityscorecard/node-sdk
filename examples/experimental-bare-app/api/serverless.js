const fastify = require("fastify");
const path = require("path");
const static = require("fastify-static");

const server = fastify({
  logger: true,
});

server.get('/', async (request, reply) => reply.send("hi"));

server.register(static, {
  root: path.join(__dirname, '..', 'public'),
  prefix: '/public/',
});

const start = async () => await server.listen(3000);

start();