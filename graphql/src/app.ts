'use strict'

require('dotenv').config()

import {fastify, FastifyReply, FastifyRequest} from 'fastify';
// @ts-ignore
import helmet from 'fastify-helmet';
import {set} from 'lodash';
import {ApolloServer} from 'apollo-server-fastify';
import {makeExecutableSchema} from 'graphql-tools';
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';

const build = async (opts = {}) => {
  const app = fastify(opts)

  // app.register(helmet, {
  //   contentSecurityPolicy: false
  // })

  app.register(require('fastify-compress'), {
    global: true,
    encodings: ['deflate', 'gzip']
  })

  app.register(require('./routes/index'))

  const loadDynamicSchema = async () => {
    const {typeDefs, resolvers} = require('./schema/schema')
    return {
      typeDefs,
      resolvers,
    }
  }

  const {typeDefs, resolvers} = await loadDynamicSchema()

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

  app.get('/schema/reload', async (req: FastifyRequest, res: FastifyReply) => {
    const {typeDefs, resolvers} = await loadDynamicSchema()
    const newSchema = makeExecutableSchema({
      typeDefs,
      resolvers
    })
    // @ts-ignore
    const schemaDerivedData = await server.generateSchemaDerivedData(newSchema)
    set(server, 'schema', newSchema)
    set(server, 'state.schemaManager.schemaDerivedData', schemaDerivedData)
    res.send({status: 'ok'})
  });

  await server.start();
  app.register(server.createHandler());

  return app;
}

export {
  build
}
