import prisma from '../lib/prisma';

const getListing = async (tableName: string) => {
  let result = [];

  try {
    const sql = `SELECT *
                 FROM ${tableName}`;
    result = await prisma.$queryRawUnsafe(sql) as any[];
  } catch (e) {
    console.log(e)
  }

  return result
}

export {
  getListing
}
