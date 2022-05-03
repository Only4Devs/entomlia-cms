import {FastifyReply} from 'fastify';
import {CustomRequest} from '../types/custom-request';
import {
  createCollectionType,
  getBySlug,
  getListing,
  updateCollectionType,
  deleteCollectionType
} from '../services/collection-type';

const listing = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await getListing()
    res.status(200).send(result)
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const getCollectionTypeBySlug = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await getBySlug(req.params.slug)
    res.status(200).send(result)
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const create = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await createCollectionType(req.body);
    res.status(201).send(result)
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const update = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await updateCollectionType(parseFloat(req.params.id), req.body);
    res.status(201).send({status: 'ok'})
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const deleteCollection = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await deleteCollectionType(parseFloat(req.params.id));
    res.status(201).send({status: 'ok'})
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

export {
  listing,
  getCollectionTypeBySlug,
  create,
  update,
  deleteCollection
}
