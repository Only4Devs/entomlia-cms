import {FastifyReply} from 'fastify';
import {CustomRequest} from '../types/custom-request';
import {CustomFastifyInstance} from '../types/custom-fastify-instance';
import {createAdmin} from '../services/admin';

const create = async (req: CustomRequest, res: FastifyReply, fastify: CustomFastifyInstance) => {
  try {
    const result = await createAdmin(fastify, req.body.username, req.body.email, req.body.password, req.body.active);
    console.log('result', result)
    res.status(201).send({status: 'ok'})
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

export {
  create
}
