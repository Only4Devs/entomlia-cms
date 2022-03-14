import prismaContent from '../lib/prisma-content';

const getListing = async (tableName: string) => {
  let result = [];

  try {
    const sql = `SELECT *
                 FROM ${tableName}`;
    result = await prismaContent.$queryRawUnsafe(sql) as any[];
  } catch (e) {
    console.log(e)
  }

  return result
}

export {
  getListing
}
