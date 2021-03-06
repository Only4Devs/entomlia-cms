'use strict'

require('dotenv').config()

import {
  capitalizeFirstLetter,
  defineFieldType,
  getQueryByIdTableArray,
  getQueryBySlugTableArray,
  getQueryTableArray
} from './lib/helper';
import {QueryTypes, Sequelize} from 'sequelize';
import {fastify, FastifyReply, FastifyRequest} from 'fastify';
// @ts-ignore
import helmet from 'fastify-helmet';
import {set} from 'lodash';
import {ApolloServer} from 'apollo-server-fastify';
import {makeExecutableSchema} from 'graphql-tools';
import {
  ApolloServerPluginLandingPageDisabled,
  ApolloServerPluginLandingPageGraphQLPlayground
} from 'apollo-server-core';

const build = async (opts = {}) => {
  const app = fastify(opts)
  const sequelizeDB = new Sequelize(process.env.DATABASE_URL!!);
  const sequelizeContent = new Sequelize(process.env.DATABASE_CONTENT_URL!!);

  // app.register(helmet, {
  //   contentSecurityPolicy: false
  // })

  app.register(require('fastify-compress'), {
    global: true,
    encodings: ['deflate', 'gzip']
  })

  app.register(require('./routes/index'))

  const loadDatabaseDefinitions = async () => {
    console.log('loadDatabaseDefinitions');
    const sql = `
      SELECT id, tableName, title, slug
      FROM CollectionType
    `;
    const tables: Array<any> = await sequelizeDB.query(sql, {type: QueryTypes.SELECT});

    const sqlColumns = `
      SELECT *
      FROM CollectionTypeField
    `;
    const columns: Array<any> = await sequelizeDB.query(sqlColumns, {type: QueryTypes.SELECT});

    tables.forEach(table => {
      table.columns = columns.filter(column => column.collectionTypeId === table.id);
    });

    return tables;
  }

  const loadDynamicSchema = async () => {
    const tables = await loadDatabaseDefinitions()
    console.log('tables', tables);

    let typeDefs = '';
    tables.forEach(table => {
      const fields = [];
      fields.push('id: Int');
      fields.push('createdAt: String');
      fields.push('updatedAt: String');
      table.columns.forEach((column: any) => {
        fields.push(`${column.slug}: ${defineFieldType(column)}`);
      });
      typeDefs += `
        type ${table.tableName} {
          ${fields.join(', ')}
        }
      `;
    });

    let query = 'type Query {';
    const queryParts: Array<string> = [];
    tables.forEach(table => {
      queryParts.push(getQueryTableArray(table.tableName));
      queryParts.push(getQueryByIdTableArray(table.tableName));
      const fieldsAsUrl = table.columns.filter((it: any) => it.makeUrl);
      fieldsAsUrl.forEach((it: any) => {
        queryParts.push(getQueryBySlugTableArray(table.tableName, it.slug));
      });
    });
    query += queryParts.join(', ');
    query += '}';
    typeDefs += `
      ${query}
    `;

    console.log('typeDefs', typeDefs);

    const resolvers: any = {
      Query: {}
    };
    tables.forEach(table => {
      resolvers.Query[table.tableName] = async () => {
        return await sequelizeContent.query(`SELECT *
                                             FROM ${table.tableName}`, {type: QueryTypes.SELECT});
      };
      resolvers.Query[`${table.tableName}ById`] = async (obj: any, args: any, context: any) => {
        return await sequelizeContent.query(`SELECT *
                                             FROM ${table.tableName}
                                             WHERE id = ?`, {
          type: QueryTypes.SELECT,
          replacements: [args['id']]
        });
      };

      const fieldsAsUrl = table.columns.filter((it: any) => it.makeUrl);
      fieldsAsUrl.forEach((it: any) => {
        resolvers.Query[`${table.tableName}By${capitalizeFirstLetter(it.slug)}`] = async (obj: any, args: any, context: any) => {
          return await sequelizeContent.query(`SELECT *
                                               FROM ${table.tableName}
                                               WHERE ${it.slug} = ?`, {
            type: QueryTypes.SELECT,
            replacements: [args[it.slug]]
          });
        };
      });
    });

    return {
      typeDefs,
      resolvers,
    }
  }

  const {typeDefs, resolvers} = await loadDynamicSchema()

  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // context: {db}
    plugins: [
      process.env.NODE_ENV === 'production'
        ? ApolloServerPluginLandingPageDisabled()
        : ApolloServerPluginLandingPageGraphQLPlayground(),
    ],
  });

  app.get('/schema/reload', async (req: FastifyRequest, res: FastifyReply) => {
    const {typeDefs, resolvers} = await loadDynamicSchema()
    const newSchema = makeExecutableSchema({
      typeDefs,
      resolvers
    })
    // @ts-ignore
    const schemaDerivedData = await server.generateSchemaDerivedData(newSchema)
    set(server, 'schema', newSchema)
    set(server, 'state.schemaManager.schemaDerivedData', schemaDerivedData)
    res.send({status: 'ok'})
  });

  await server.start();
  app.register(server.createHandler());

  return app;
}

export {
  build
}
