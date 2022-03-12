import {FastifyReply} from 'fastify';
import {CustomRequest} from '../types/custom-request';
import {CustomFastifyInstance} from '../types/custom-fastify-instance';
import prisma from '../lib/prisma';

const getProfile = async (req: CustomRequest, res: FastifyReply, fastify: CustomFastifyInstance) => {
  try {
    const profile = await prisma.admin.findFirst({
      where: {
        id: req.user.id,
      },
    });
    res.status(201).send(profile)
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

export {
  getProfile
}
