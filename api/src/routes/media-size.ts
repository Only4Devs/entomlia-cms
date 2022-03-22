import {CustomFastifyInstance} from '../types/custom-fastify-instance';
import {create, listing, remove, update} from '../controllers/media-size';

module.exports = (fastify: CustomFastifyInstance, opts: Object, done: Function) => {
  fastify.get('/media-size', {preValidation: [fastify.authenticate]}, listing)
  fastify.post('/media-size', {preValidation: [fastify.authenticate]}, create)
  fastify.put('/media-size/:id', {preValidation: [fastify.authenticate]}, update)
  fastify.delete('/media-size/:id', {preValidation: [fastify.authenticate]}, remove)

  done()
}
