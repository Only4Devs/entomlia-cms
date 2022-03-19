import {CustomFastifyInstance} from '../types/custom-fastify-instance';
import {update} from '../controllers/collection-type-field';

module.exports = (fastify: CustomFastifyInstance, opts: Object, done: Function) => {
  fastify.put('/collection-type-field/:id', {preValidation: [fastify.authenticate]}, update)

  done()
}
