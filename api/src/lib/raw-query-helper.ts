import {isNotEmpty} from './request-helper'
import prismaContent from './prisma-content';
import {v4 as uuidv4} from 'uuid';
import slugify from 'slugify';

const generateTableName = (tableName: string) => {
  const value = tableName.split('-')
  if (value.length > 1) {
    for (let i = 0; i < value.length; i++) {
      if (i > 0) {
        value[i] = value[i].charAt(0).toUpperCase() + value[i].slice(1)
      }
    }
  }
  return value.join('')
}

const createTable = async (tableData: any, columnsData: Array<any>) => {
  let sqlFields = ''
  let sqlUniqueKeys = ''
  for (let field of columnsData) {
    let sqlDefaultValue = '';
    let value = field.defaultValue
    let fieldType = field.fieldType
    if (fieldType === 'boolean') {
      if (value === 'true') {
        value = 1
      } else if (value === 'false') {
        value = 0
      }
    }

    if (fieldType === 'varchar') {
      fieldType = `${fieldType}(${field.maxLength})`
    }

    if (isNotEmpty('defaultValue', field)) {
      sqlDefaultValue += `DEFAULT '${value}'`
    }
    sqlFields += `
      \`${field.slug}\`     ${prepareSqlForColumn(field, false)},
    `

    if (field.isUnique) {
      sqlUniqueKeys += `
        UNIQUE INDEX \`${tableData.tableName}_${field.slug}_key\`(\`${field.slug}\`),
      `
    }
  }

  let sql = `
    CREATE TABLE \`${tableData.tableName}\`
    (
      \`id\`        INTEGER NOT NULL AUTO_INCREMENT,
      ${sqlFields}
                    \`createdAt\` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP (3),
      \`updatedAt\` DATETIME(3) NOT NULL,

      ${sqlUniqueKeys} PRIMARY KEY (\`id\`)
    ) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
  `
  console.log('sql', sql)
  await prismaContent.$queryRawUnsafe(sql)
}

const renameTable = async (oldName: string, newName: string) => {
  const sql = `RENAME TABLE ${oldName} TO ${newName};`
  await prismaContent.$queryRawUnsafe(sql)
}

const dropTable = async (tableName: string) => {
  const sql = `DROP TABLE ${tableName};`
  await prismaContent.$queryRawUnsafe(sql)
}

const dropColumn = async (tableName: string, columnName: string) => {
  const sql = `ALTER TABLE ${tableName} DROP COLUMN ${columnName};`
  await prismaContent.$queryRawUnsafe(sql)
}

const prepareSqlForColumn = (field: any, withFieldName = true) => {
  let sql = ``
  let value = field.defaultValue
  let sqlDefaultValue = '';
  let fieldType = field.fieldType
  let isStringDefaultValue = true
  if (fieldType === 'boolean' || fieldType === 'number') {
    isStringDefaultValue = false
  }
  if (fieldType === 'varchar') {
    let maxLength = 255
    if (fieldType.maxLength !== '' && fieldType.maxLength !== undefined && fieldType.maxLength !== null) {
      maxLength = fieldType.maxLength
    }
    fieldType = `${fieldType}(${maxLength})`
  } else if (fieldType === 'enum') {
    const enumValues = field.enumValues.split(',').map((it: string) => `'${it}'`).join(',')
    fieldType = `${fieldType}(${enumValues})`
  } else if (fieldType === 'editor') {
    fieldType = 'TEXT'
  } else if (fieldType === 'date') {
    fieldType = field.dateType
  } else if (fieldType === 'uuid') {
    fieldType = 'CHAR(36)'
  } else if (fieldType === 'number') {
    fieldType = field.numberType
    if (fieldType === 'decimal') {
      fieldType += '(10, 2)'
    }
  }

  if (['date', 'time', 'datetime'].indexOf(fieldType) !== -1) {
    if (!isNotEmpty('defaultValue', field)) {
      sqlDefaultValue = `DEFAULT NOW()`
    } else {
      sqlDefaultValue = `DEFAULT NULL`
    }
  } else {
    if (isNotEmpty('defaultValue', field)) {
      if (isStringDefaultValue) {
        sqlDefaultValue += `DEFAULT '${value}'`
      } else {
        sqlDefaultValue += `DEFAULT ${value}`
      }
    }
  }

  sql += `${withFieldName ? field.slug : ''} ${fieldType} ${sqlDefaultValue} ${field.isRequired ? 'NOT NULL' : 'NULL'}`

  return sql
}

const addColumn = async (tableName: string, field: any) => {
  const sql = `ALTER TABLE ${tableName}
    ADD ${prepareSqlForColumn(field)};`
  console.log('sql', sql);
  await prismaContent.$queryRawUnsafe(sql)
}

const modifyColumn = async (tableName: string, field: any) => {
  const sql = `ALTER TABLE ${tableName} MODIFY ${prepareSqlForColumn(field)};`
  console.log('sql', sql);
  await prismaContent.$queryRawUnsafe(sql)
}

const handleCustomValue = (field: any, value: any, postData: any): any => {
  if (field.makeUrl) {
    value = slugify(value, {replacement: '-', lower: true})
    if (value === undefined || value === null || value.length === 0) {
      try {
        value = slugify(postData[field.sourceUrl], {replacement: '-', lower: true})
      } catch (e) {
      }
    }
  }
  return value
}

const insertRecord = async (tableName: string, data: any, fields: Array<any>) => {
  const parts: Array<string> = []
  for (const field of fields) {
    if (field.fieldType === 'uuid') {
      parts.push(`'${uuidv4()}'`)
    } else {
      let value = data[field.slug]
      if (value === undefined) {
        value = null
      }
      const fieldFound = fields.find((it: any) => it.slug === field.slug)
      if (fieldFound !== undefined && fieldFound !== null) {
        value = handleCustomValue(field, value, data)
        if (['varchar', 'enum', 'editor', 'text', 'uuid', 'date'].indexOf(field.fieldType) !== -1) {
          parts.push(`'${value}'`)
        } else {
          parts.push(`${value}`)
        }
      } else {
        parts.push('NULL')
      }
    }
  }

  const sql = `INSERT INTO ${tableName} (${fields.map(it => it.slug).join(',')}, updatedAt)
               VALUES (${parts.join(',')}, NOW())`

  console.log('sql', sql)
  return await prismaContent.$queryRawUnsafe(sql)
}

const updateRow = async (tableName: string, id: string | number, data: any, fields: Array<any>) => {
  const parts: Array<string> = []
  for (const field of fields) {
    if (field.fieldType === 'uuid') {
      parts.push(`${field.slug} = '${uuidv4()}'`)
    } else {
      let value = data[field.slug]
      if (value === undefined) {
        value = null
      }
      const fieldFound = fields.find((it: any) => it.slug === field.slug)
      if (fieldFound !== undefined && fieldFound !== null) {
        value = handleCustomValue(field, value, data)
        if (['varchar', 'enum', 'editor', 'text', 'uuid', 'date'].indexOf(field.fieldType) !== -1) {
          parts.push(`${field.slug} = '${value}'`)
        } else {
          parts.push(`${field.slug} = ${value}`)
        }
      } else {
        parts.push(`${field.slug} = NULL`)
      }
    }
  }

  const sql = `UPDATE ${tableName}
               SET ${parts.join(', ')}
               WHERE id = ${id}`

  console.log('sql', sql)
  return await prismaContent.$queryRawUnsafe(sql)
}

const deleteRow = async (tableName: string, id: string | number) => {
  const sql = `DELETE FROM ${tableName}
               WHERE id = ${id}`

  console.log('sql', sql)
  return await prismaContent.$queryRawUnsafe(sql)
}

const listing = async (tableName: string, fields: string[]) => {
  let result = []

  try {
    const sql = `SELECT id, ${fields.join(', ')}, createdAt, updatedAt
                 FROM ${tableName}`
    result = await prismaContent.$queryRawUnsafe(sql) as any[]
  } catch (e) {
    console.log(e)
  }

  return result
}

const getByTableNameAndId = async (tableName: string, id: string | number) => {
  let result = []

  try {
    const sql = `SELECT *
                 FROM ${tableName}
                 WHERE id = '${id}'`
    result = await prismaContent.$queryRawUnsafe(sql) as any[]
    if (result !== undefined && result !== null && result.length > 0) {
      result = result[0]
    }
  } catch (e) {
    console.log(e)
  }

  return result
}

export {
  generateTableName,
  createTable,
  renameTable,
  dropTable,
  dropColumn,
  addColumn,
  modifyColumn,
  insertRecord,
  updateRow,
  deleteRow,
  listing,
  getByTableNameAndId
}
