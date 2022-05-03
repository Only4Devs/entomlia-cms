import {FastifyReply} from 'fastify';
import {findByEmailOrUsername, validatePassword} from '../services/admin';
import {CustomRequest} from '../types/custom-request';
import {CustomFastifyInstance} from '../types/custom-fastify-instance';

const authenticate = async (req: CustomRequest, res: FastifyReply, fastify: CustomFastifyInstance) => {
  let admin = null
  try {
    admin = await findByEmailOrUsername(req.body.login)
  } catch (e) {
    console.log(e);
  }

  if (admin !== null) {
    if (await validatePassword(admin, req.body.password, fastify)) {
      const token = fastify.jwt.sign({
        username: admin.username,
        email: admin.email,
        id: admin.id,
      });
      res.send({status: 'ok', token})
    } else {
      res.status(400).send({status: 'error'})
    }
  } else {
    res.status(400).send({status: 'error'})
  }
}

const logout = async (req: CustomRequest, res: FastifyReply, fastify: CustomFastifyInstance) => {
  res.send({status: 'ok'})
}

export {
  authenticate,
  logout
}
