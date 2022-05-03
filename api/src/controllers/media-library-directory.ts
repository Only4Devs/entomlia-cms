import {FastifyReply} from 'fastify';
import {CustomRequest} from '../types/custom-request';
import {createSize, deleteSize, getListing, updateSize} from '../services/media-library-directory';

const listing = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await getListing()
    res.status(200).send(result)
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const create = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await createSize(req.body);
    res.status(201).send(result)
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const update = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await updateSize(parseFloat(req.params.id), req.body);
    res.status(201).send({status: 'ok'})
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const remove = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await deleteSize(parseFloat(req.params.id));
    res.status(201).send({status: 'ok'})
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

export {
  listing,
  create,
  update,
  remove
}
