import {FastifyReply} from 'fastify';
import {CustomRequest} from '../types/custom-request';
import {CustomFastifyInstance} from '../types/custom-fastify-instance';
import {getProfile} from '../controllers/profile';

module.exports = (fastify: CustomFastifyInstance, opts: Object, done: Function) => {
  fastify.get('/profile', {preValidation: [fastify.authenticate]}, (req: CustomRequest, res: FastifyReply) => getProfile(req, res, fastify))

  done()
}
