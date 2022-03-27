import {FastifyReply} from 'fastify';
import {CustomRequest} from '../types/custom-request';
import {
  updateFormConfiguration,
} from '../services/form-configuration';
import {getBySlug} from '../services/collection-type';
import prisma from '../lib/prisma';

const getFormConfigurationBySlug = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const collectionType = await getBySlug(req.params.slug)
    let formConfiguration = await prisma.formConfiguration.findFirst({
      where: {
        collectionTypeId: collectionType.id
      },
    })

    if (formConfiguration === undefined || formConfiguration === null) {
      formConfiguration = await prisma.formConfiguration.create({
        data: {
          collectionTypeId: collectionType.id
        }
      })
    }

    if (formConfiguration.content !== undefined && formConfiguration.content !== null) {
      formConfiguration.content = JSON.parse(formConfiguration.content)
    } else {
      formConfiguration.content = [[], [], [], collectionType.fields] as any
    }

    res.status(200).send(formConfiguration)
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

const update = async (req: CustomRequest, res: FastifyReply) => {
  try {
    const result = await updateFormConfiguration(parseFloat(req.params.id), req.body);
    console.log('result', result)
    res.status(200).send({status: 'ok'})
  } catch (e) {
    console.log(e)
    res.status(400).send({status: 'error'})
  }
}

export {
  getFormConfigurationBySlug,
  update,
}
