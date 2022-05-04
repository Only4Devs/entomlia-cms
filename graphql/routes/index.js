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

async function routes(fastify, options) {
  fastify.get('/', opts, async (request, reply) => {
    return {status: 'ok'}
  })
}

module.exports = routes
