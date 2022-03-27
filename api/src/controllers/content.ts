import {FastifyReply} from 'fastify';
import {CustomRequest} from '../types/custom-request';
import {getByTableNameAndId, insertRecord, listing} from '../lib/raw-query-helper';
import {getBySlug} from '../services/collection-type';
import CollectionType from '../models/collection-type';
import CollectionTypeField from '../models/collection-type-field';

const getListing = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const collectionType: CollectionType = await getBySlug(req.params.slug)
    const rows = await listing(req.params.slug, collectionType.fields.map((it: CollectionTypeField) => it.slug))
    res.status(200).send(rows)
  } catch (e) {
    res.status(400).send({status: 'error'})
  }
}

const getRow = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const collectionType: CollectionType = await getBySlug(req.params.slug)
    const row = await getByTableNameAndId(req.params.slug, req.params.id)
    res.status(200).send(row)
  } catch (e) {
    res.status(400).send({status: 'error'})
  }
}

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
  updateRecord,
  getListing,
  getRow
}
