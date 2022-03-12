import {CustomFastifyInstance} from '../types/custom-fastify-instance';
import {create, getCollectionTypeBySlug, listing, update, deleteCollection} from '../controllers/collection-type';

module.exports = (fastify: CustomFastifyInstance, opts: Object, done: Function) => {
  fastify.get('/collection-type', {preValidation: [fastify.authenticate]}, listing)
  fastify.get('/collection-type/:slug', {preValidation: [fastify.authenticate]}, getCollectionTypeBySlug)
  fastify.post('/collection-type', {preValidation: [fastify.authenticate]}, create)
  fastify.put('/collection-type/:id', {preValidation: [fastify.authenticate]}, update)
  fastify.delete('/collection-type/:id', {preValidation: [fastify.authenticate]}, deleteCollection)

  done()
}
