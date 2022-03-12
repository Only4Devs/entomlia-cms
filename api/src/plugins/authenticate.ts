import {CustomFastifyInstance} from '../types/custom-fastify-instance';
import {FastifyReply} from 'fastify';

const fp = require("fastify-plugin")

module.exports = fp(async function (fastify: CustomFastifyInstance, opts: {}) {
  fastify.decorate("authenticate", async function (request: any, reply: FastifyReply) {
    try {
      await request.jwtVerify()
    } catch (err) {
      reply.send(err)
    }
  })
})
