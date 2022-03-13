import prisma from '../lib/prisma'
import {prepareUrl} from '../lib/url-helper'
import {isNotEmpty} from '../lib/request-helper'
import {
  addColumn,
  createTable,
  dropColumn,
  dropTable,
  generateTableName,
  modifyColumn,
  renameTable
} from '../lib/raw-query-helper'

const getListing = async () => {
  let result = [];

  try {
    result = await prisma.collectionType.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        tableName: true,
        icon: true,
      },
    }) as any[];
  } catch (e) {
    console.log(e)
  }

  return result
}

const prepareFields = (fields: any) => {
  fields.filter((it: any) => it.fieldType === 'enum').forEach((item: any) => {
    item.values = item.enumValues.split(',')
  })

  return fields
}

const getBySlug = async (slug: string) => {
  try {
    const result = await prisma.collectionType.findFirst({
      where: {
        slug: slug,
      },
      select: {
        id: true,
        title: true,
        slug: true,
        tableName: true,
        icon: true,
      },
    }) as any;

    result.fields = await prisma.collectionTypeField.findMany({
      where: {
        collectionTypeId: result.id,
      },
    }) as any;
    if (result.fields) {
      result.fields = prepareFields(result.fields)
    }

    return result
  } catch (e) {
    console.log(e)
    throw e
  }
}

const prepareFieldData = (field: any) => {
  field.slug = prepareUrl(isNotEmpty('slug', field) ? field.slug : field.title, false)
  if (isNotEmpty('defaultValue', field)) {
    field.defaultValue = field.defaultValue.toString()
  }
  if (isNotEmpty('maxLength', field)) {
    field.maxLength = parseFloat(field.maxLength)
  }
  if (isNotEmpty('minLength', field)) {
    field.minLength = parseFloat(field.minLength)
  }

  return field
}

const createSingleField = async (collectionTypeId: number, field: any) => {
  return await prisma.collectionTypeField.create({
    data: {
      CollectionType: {
        connect: {
          id: collectionTypeId
        }
      },
      ...field
    }
  })
}

const updateSingleField = async (collectionTypeId: number, field: any) => {
  return await prisma.collectionTypeField.update({
    where: {
      id: field.id
    },
    data: {
      ...field
    }
  })
}

const createCollectionType = async (inputData: any) => {
  const fields = [...inputData.fields]
  delete inputData.fields
  inputData.slug = prepareUrl(isNotEmpty('slug', inputData) ? inputData.slug : inputData.title)
  inputData.tableName = generateTableName(inputData.slug)

  const collectionType = await prisma.collectionType.create({
    data: inputData
  })

  for (let field of fields) {
    field = prepareFieldData(field)
    await createSingleField(collectionType.id, field)
  }

  await createTable(inputData, fields)

  return collectionType
}

const deleteCollectionFieldById = async (id: number) => {
  const sqlDeleteFields = `DELETE
                           FROM CollectionTypeField
                           WHERE id = ${id};`
  await prisma.$queryRawUnsafe(sqlDeleteFields)
}

const getCollectionFullData = async (id: number) => {
  return await prisma.collectionType.findUnique({
    where: {
      id: id,
    },
    select: {
      id: true,
      tableName: true,
      slug: true,
      title: true,
      icon: true,
    },
  }) as any
}

const updateCollectionType = async (id: number, inputData: any) => {
  try {
    const fields = [...inputData.fields]
    delete inputData.fields

    const collectionType = await getCollectionFullData(id)
    if (inputData.title !== collectionType.title) {
      inputData.slug = prepareUrl(isNotEmpty('slug', inputData) ? inputData.slug : inputData.title)
      inputData.tableName = generateTableName(inputData.slug)
      collectionType.tableName = inputData.tableName
      await renameTable(inputData.tableName, inputData.slug)
    }

    await prisma.collectionType.update({
      where: {
        id: id,
      },
      data: inputData
    })

    if (fields) {
      for (let field of fields) {
        field = prepareFieldData(field)

        if (field.toDelete) {
          await dropColumn(collectionType.tableName, field.slug)
          await deleteCollectionFieldById(field.id)
        } else {
          if (field.id !== undefined && field.id !== null) {
            await updateSingleField(collectionType.id, field)
            await modifyColumn(collectionType.tableName, field)
          } else {
            await createSingleField(collectionType.id, field)
            await addColumn(collectionType.tableName, field)
          }
        }
      }
    }

    return collectionType
  } catch (e) {
    throw e
  }
}

const deleteCollectionType = async (id: number) => {
  try {
    const collectionType = await prisma.collectionType.findUnique({
      where: {
        id: id,
      },
      select: {
        id: true,
        tableName: true,
      },
    }) as any;

    await dropTable(collectionType.tableName)

    const sqlDeleteFields = `DELETE
                             FROM CollectionTypeField
                             WHERE collectionTypeId = ${id};`
    await prisma.$queryRawUnsafe(sqlDeleteFields)

    const sqlDeleteCollection = `DELETE
                                 FROM CollectionType
                                 WHERE id = ${id};`
    await prisma.$queryRawUnsafe(sqlDeleteCollection)
  } catch (e) {
    throw e
  }
}

export {
  getListing,
  getBySlug,
  createCollectionType,
  updateCollectionType,
  deleteCollectionType
}
