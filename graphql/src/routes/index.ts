import {FastifyReply, FastifyRequest} from 'fastify';

const opts = {
  schema: {
    response: {
      200: {
        type: 'object',
        properties: {
          status: {type: 'string'}
        }
      }
    }
  }
}

async function routes(fastify: any, options: any) {
  fastify.get('/', opts, async (request: FastifyRequest, reply: FastifyReply) => {
    return {status: 'ok'}
  })
}

module.exports = routes
