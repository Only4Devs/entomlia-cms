import {FastifyReply} from 'fastify';
import {CustomRequest} from '../types/custom-request';
import {createFile, getListing, updateFile} from '../services/media-library';

const listing = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const slug = req.params.slug || null
    const result = await getListing()
    res.status(200).send(result)
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const create = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await createFile(req.body);
    console.log('result', result)
    res.status(201).send(result)
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const update = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await updateFile(parseFloat(req.params.id), req.body);
    console.log('result', result)
    res.status(201).send({status: 'ok'})
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const remove = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await deleteFile(parseFloat(req.params.id));
    console.log('result', result)
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
