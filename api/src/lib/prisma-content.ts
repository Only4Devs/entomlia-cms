import {PrismaClient} from '@prisma/client';

let prismaContent: PrismaClient

prismaContent = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_CONTENT_URL,
    },
  },
})

export default prismaContent
