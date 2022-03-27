import prisma from '../lib/prisma'

const getListing = async () => {
  let result = [];

  try {
    result = await prisma.mediaLibrary.findMany({
      select: {
        id: true,
        createdAt: true,
        updatedAt: true,
      },
    }) as any[];
  } catch (e) {
    console.log(e)
  }

  return result
}

const createFile = async (inputData: any) => {
  return await prisma.mediaLibrary.create({
    data: {
      ...inputData
    }
  })
}

const updateFile = async (mediaLibraryId: number, inputData: any) => {
  delete inputData.id

  return await prisma.mediaLibrary.update({
    where: {
      id: mediaLibraryId
    },
    data: {
      ...inputData
    }
  })
}

const deleteFile = async (id: number) => {
  try {
    await prisma.mediaLibrary.delete({
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
  createFile,
  updateFile,
  deleteFile,
}
