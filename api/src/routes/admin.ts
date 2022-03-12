import {FastifyReply} from 'fastify';
import {CustomRequest} from '../types/custom-request';
import {CustomFastifyInstance} from '../types/custom-fastify-instance';
import {create} from '../controllers/admin';

module.exports = (fastify: CustomFastifyInstance, opts: Object, done: Function) => {
  fastify.post('/admin', {preValidation: [fastify.authenticate]}, (req: CustomRequest, res: FastifyReply) => create(req, res, fastify))

  done()
}
