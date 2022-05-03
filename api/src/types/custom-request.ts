import {FastifyRequest} from 'fastify';

export interface CustomRequest extends FastifyRequest<{ Body: any, Params: any }> {
  body: any;
  params: any;
  user?: any;
  raw: any;
}
