import prisma from '../lib/prisma'
import {prepareUrl} from '../lib/url-helper'

const getListing = async () => {
  let result = [];

  try {
    result = await prisma.mediaSize.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        width: true,
        height: true,
        mode: true,
      },
    }) as any[];
  } catch (e) {
    console.log(e)
  }

  return result
}

const createSize = async (inputData: any) => {
  inputData.slug = prepareUrl(inputData.title)
  return await prisma.mediaSize.create({
    data: {
      ...inputData
    }
  })
}

const updateSize = async (mediaSizeId: number, inputData: any) => {
  delete inputData.id
  inputData.slug = prepareUrl(inputData.title)

  return await prisma.mediaSize.update({
    where: {
      id: mediaSizeId
    },
    data: {
      ...inputData
    }
  })
}

const deleteSize = async (id: number) => {
  try {
    await prisma.mediaSize.delete({
      where: {
        id
      }
    })
  } catch (e) {
    throw e
  }
}

export {
  getListing,
  createSize,
  updateSize,
  deleteSize,
}
