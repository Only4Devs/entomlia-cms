import prisma from '../lib/prisma'
import {prepareUrl} from '../lib/url-helper'

const getListing = async () => {
  let result = [];

  try {
    result = await prisma.mediaLibraryDirectory.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as any[];
  } catch (e) {
    console.log(e)
  }

  return result
}

const createSize = async (inputData: any) => {
  inputData.slug = prepareUrl(inputData.title)
  return await prisma.mediaLibraryDirectory.create({
    data: {
      ...inputData
    }
  })
}

const updateSize = async (mediaLibraryDirectoryId: number, inputData: any) => {
  delete inputData.id
  inputData.slug = prepareUrl(inputData.title)

  return await prisma.mediaLibraryDirectory.update({
    where: {
      id: mediaLibraryDirectoryId
    },
    data: {
      ...inputData
    }
  })
}

const deleteSize = async (id: number) => {
  try {
    await prisma.mediaLibraryDirectory.delete({
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
