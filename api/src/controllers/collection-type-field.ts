import {FastifyReply} from 'fastify';
import {CustomRequest} from '../types/custom-request';
import {updateSingleField} from '../services/collection-type';

const update = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await updateSingleField(parseFloat(req.params.id), req.body);
    res.status(201).send({status: 'ok'})
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

export {
  update,
}
