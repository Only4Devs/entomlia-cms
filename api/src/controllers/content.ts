import {FastifyReply} from 'fastify';
import {CustomRequest} from '../types/custom-request';
import {insertRecord} from '../lib/raw-query-helper';
import {getBySlug} from '../services/collection-type';
import CollectionType from '../models/collection-type';

const createRecord = async (req: CustomRequest, res: FastifyReply) => {
  const slug = req.params.slug
  const collectionType: CollectionType = await getBySlug(slug)

  try {
    await insertRecord(collectionType.tableName, req.body, collectionType.fields)
    res.status(200).send({status: 'ok'})
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const updateRecord = async (req: CustomRequest, res: FastifyReply) => {
  res.status(200).send({status: 'ok'})
  // res.status(400).send({status: 'error'})
}

export {
  createRecord,
  updateRecord
}
