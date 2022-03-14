import {CustomFastifyInstance} from '../types/custom-fastify-instance';
import {createRecord, updateRecord} from '../controllers/content';

module.exports = (fastify: CustomFastifyInstance, opts: Object, done: Function) => {
  fastify.post('/content/:slug', {preValidation: [fastify.authenticate]}, createRecord)
  fastify.put('/content/:slug/:id', {preValidation: [fastify.authenticate]}, updateRecord)

  done()
}
