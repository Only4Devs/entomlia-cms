import {CustomFastifyInstance} from '../types/custom-fastify-instance';
import {create, listing, remove, update} from '../controllers/media-library';

module.exports = (fastify: CustomFastifyInstance, opts: Object, done: Function) => {
  fastify.get('/media-library', {preValidation: [fastify.authenticate]}, listing)
  fastify.get('/media-library/:slug', {preValidation: [fastify.authenticate]}, listing)
  fastify.post('/media-library', {preValidation: [fastify.authenticate]}, create)
  fastify.put('/media-library/:id', {preValidation: [fastify.authenticate]}, update)
  fastify.delete('/media-library/:id', {preValidation: [fastify.authenticate]}, remove)

  done()
}
