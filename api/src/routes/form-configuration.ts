import {CustomFastifyInstance} from '../types/custom-fastify-instance';
import {getFormConfigurationBySlug, update} from '../controllers/form-configuration';

module.exports = (fastify: CustomFastifyInstance, opts: Object, done: Function) => {
  fastify.get('/form-configuration/:slug', {preValidation: [fastify.authenticate]}, getFormConfigurationBySlug)
  fastify.put('/form-configuration/:id', {preValidation: [fastify.authenticate]}, update)

  done()
}
