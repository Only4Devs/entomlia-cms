import {fastify} from 'fastify';
import pino from 'pino';

const Port = process.env.PORT || 7000;
const server = fastify({
  logger: pino({level: 'info'})
});

const helmet = require('fastify-helmet')

server.register(
  helmet,
  {contentSecurityPolicy: false}
)

server.register(require('fastify-favicon'))
server.register(require('fastify-jwt'), {
  secret: 'C1st0mP4ssw0rd*R4nd4ml1!1',
})
server.register(require('fastify-bcrypt'), {
  saltWorkFactor: 12
})

server.register(require('fastify-compress'), {
  global: true,
  encodings: ['deflate', 'gzip']
})

server.register(require('fastify-cors'), {
  origin: '*',
  preflight: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Accept', 'Content-Type', 'Authorization', 'User-Agent',]
})

server.register(require('./plugins/authenticate'))

server.register(require('./routes/auth'))
server.register(require('./routes/profile'))
server.register(require('./routes/admin'))
server.register(require('./routes/collection-type'))
server.register(require('./routes/form-configuration'))

const start = async () => {
  try {
    await server.listen(Port, '0.0.0.0');
    console.log('Server started successfully');
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

(async () => {
  await start();
})();
