'use strict'

require('dotenv').config()

const fastify = require('fastify')
const helmet = require('fastify-helmet');
const schema = require('./schema/schema')
const {ApolloServer, gql} = require('apollo-server-fastify')
const {ApolloServerPluginLandingPageDisabled, ApolloServerPluginLandingPageGraphQLPlayground} = require('apollo-server-core');

function build(opts = {}) {
  return new Promise(resolve => {
    const app = fastify(opts)

    // app.register(helmet, {
    //   contentSecurityPolicy: false
    // })

    app.register(require('fastify-compress'), {
      global: true,
      encodings: ['deflate', 'gzip']
    })

    app.register(require('./routes/index'))

    const {typeDefs, resolvers} = schema;

    const server = new ApolloServer({
      typeDefs,
      resolvers,
      // context: {db}
      plugins: [
        process.env.NODE_ENV === 'production'
          ? ApolloServerPluginLandingPageDisabled()
          : ApolloServerPluginLandingPageGraphQLPlayground(),
      ],
    });

    (async () => {
      await server.start();
      app.register(server.createHandler());

      resolve(app);
    })();
  })
}

module.exports = build
