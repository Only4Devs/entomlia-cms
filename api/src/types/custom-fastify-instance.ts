import {FastifyInstance} from 'fastify';

export type CustomFastifyInstance = FastifyInstance & {
  bcrypt: {} & {
    hash: Function,
    compare: Function,
  };
  jwt: {} & {
    sign: Function,
    verify: Function,
  },
  authenticate: any
};
