'use strict'

require('dotenv').config()

const fastify = require('fastify')
const helmet = require('fastify-helmet');
const schema = require('./schema/schema')
const set = require('lodash/set')
const {ApolloServer, gql} = require('apollo-server-fastify')
const {makeExecutableSchema} = require('graphql-tools')
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

    app.get('/schema/reload', async (req, res, next) => {
      const newSchema = makeExecutableSchema({
        typeDefs: require('./schema/schema').typeDefsNew,
        resolvers
      })
      const schemaDerivedData = await server.generateSchemaDerivedData(newSchema)
      set(server, 'schema', newSchema)
      set(server, 'state.schemaManager.schemaDerivedData', schemaDerivedData)
      res.send({status: 'ok'})
      next()
    });

    (async () => {
      await server.start();
      app.register(server.createHandler());

      resolve(app);
    })();
  })
}

module.exports = build
