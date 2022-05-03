import prisma from '../lib/prisma';
import Admin from '../models/admin';
import {CustomFastifyInstance} from '../types/custom-fastify-instance';

const findByEmailOrUsername = async (login: string) => {
  return await prisma.admin.findFirst({
    where: {
      OR: [
        {
          email: login,
        },
        {
          username: login,
        },
      ],
    },
  })
}

const validatePassword = async (admin: Admin, password: string, fastify: CustomFastifyInstance) => {
  let result = false;

  try {
    result = await fastify.bcrypt.compare(password, admin.password);
  } catch (e) {
    console.log(e);
  }

  return result
}

const createAdmin = async (fastify: CustomFastifyInstance, username: string, email: string, password: string, active: boolean = true) => {
  const hashPassword = await fastify.bcrypt.hash(password)
  return await prisma.admin.create({
    data: {
      username,
      email,
      password: hashPassword,
      active,
    },
  })
}

export {
  findByEmailOrUsername,
  validatePassword,
  createAdmin,
}
