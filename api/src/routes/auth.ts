import {FastifyReply} from 'fastify';
import {authenticate, logout} from '../controllers/auth';
import {CustomRequest} from '../types/custom-request';
import {CustomFastifyInstance} from '../types/custom-fastify-instance';

module.exports = (fastify: CustomFastifyInstance, opts: Object, done: Function) => {
  fastify.post('/auth', (req: CustomRequest, res: FastifyReply) => authenticate(req, res, fastify));
  fastify.post('/auth/logout', (req: CustomRequest, res: FastifyReply) => logout(req, res, fastify));

  done()
}
