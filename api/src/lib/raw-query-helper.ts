import {isNotEmpty} from './request-helper'
import prismaContent from './prisma-content';

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
  console.log('table-data', tableData)
  console.log('columns-data', columnsData)
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

const insertRecord = async (tableName: string, data: any, fields: Array<any>) => {
  const keys = Object.keys(data)
  const parts: Array<string> = []
  for (const k of keys) {
    const value = data[k]
    console.log('value', value)
    const field = fields.find((it: any) => it.slug === k)
    if (field !== undefined && field !== null) {
      if (['varchar', 'enum', 'editor', 'text', 'uuid', 'date'].indexOf(field.fieldType) !== -1) {
        parts.push(`'${value}'`)
      } else {
        parts.push(`${value}`)
      }
    }
  }

  const sql = `INSERT INTO ${tableName} (${keys.join(',')})
               VALUES (${parts.join(',')})`

  console.log('sql', sql)
  return await prismaContent.$queryRawUnsafe(sql)
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
}
