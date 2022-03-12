import prisma from '../lib/prisma'

const updateFormConfiguration = async (id: number, inputData: any) => {
  try {
    return await prisma.formConfiguration.update({
      where: {
        id: id,
      },
      data: {
        content: JSON.stringify(inputData)
      }
    })
  } catch (e) {
    throw e
  }
}

export {
  updateFormConfiguration
}
