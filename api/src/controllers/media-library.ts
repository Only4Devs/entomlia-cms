import {FastifyReply} from 'fastify';
import {CustomRequest} from '../types/custom-request';
import {createFile, deleteFile, getListing, handleFileUpload, updateFile} from '../services/media-library';
import {config} from '../config/config';

const listing = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const slug = req.params.slug || null
    const result = await getListing(slug)
    res.status(200).send(result)
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const create = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result: any = await createFile(req.body);
    const key = 'file';
    const files = req.raw.files
    if (files[key] !== undefined && files[key] !== null) {
      try {
        await handleFileUpload(files[key], req.body.mediaLibraryDirectoryId || null, result.id)
      } catch (e) {
        console.log(e)
      }
    }
    result.path = `${config.host}/public/storage`
    if (result.mediaLibraryDirectoryId !== undefined && result.mediaLibraryDirectoryId !== null) {
      result.path += `/d${result.mediaLibraryDirectoryId}`
    }
    result.path += `/f${result.id}/${result.filename}`
    res.status(201).send(result)
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const update = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await updateFile(parseFloat(req.params.id), req.body);
    res.status(201).send({status: 'ok'})
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const remove = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await deleteFile(parseFloat(req.params.id));
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
