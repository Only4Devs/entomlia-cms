const capitalizeFirstLetter = (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

const defineFieldType = (column: any): string => {
  let fieldType = 'String';
  switch (column.fieldType) {
    case 'varchar':
      fieldType = 'String';
      break;
    case 'enum':
      fieldType = 'String';
      break;
    case 'editor':
      fieldType = 'String';
      break;
    case 'uuid':
      fieldType = 'String';
      break;
    case 'text':
      fieldType = 'String';
      break;
    case 'number':
      fieldType = 'Int';
      if (column.numberType === 'decimal') {
        fieldType = 'Float';
      }
      break;
    case 'boolean':
      fieldType = 'Boolean';
      break;
  }
  return fieldType;
}

const getQueryTableArray = (tableName: string): string => {
  return `${tableName}: [${tableName}]`
}

const getQueryByIdTableArray = (tableName: string): string => {
  return `${tableName}ById(id: Int!): [${tableName}]`
}

const getQueryBySlugTableArray = (tableName: string, slugField: string): string => {
  return `${tableName}By${capitalizeFirstLetter(slugField)}(${slugField}: String!): [${tableName}]`
}

export {
  capitalizeFirstLetter,
  defineFieldType,
  getQueryTableArray,
  getQueryByIdTableArray,
  getQueryBySlugTableArray,
}
