import {CustomFastifyInstance} from '../types/custom-fastify-instance';
import {create, listing, remove, update} from '../controllers/media-library-directory';

module.exports = (fastify: CustomFastifyInstance, opts: Object, done: Function) => {
  fastify.get('/media-library-directory', {preValidation: [fastify.authenticate]}, listing)
  fastify.post('/media-library-directory', {preValidation: [fastify.authenticate]}, create)
  fastify.put('/media-library-directory/:id', {preValidation: [fastify.authenticate]}, update)
  fastify.delete('/media-library-directory/:id', {preValidation: [fastify.authenticate]}, remove)

  done()
}
