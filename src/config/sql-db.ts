import { Sequelize } from 'sequelize';

export const sequelizeClient = new Sequelize({
  host: process.env.SQL_DB_HOST || 'localhost',
  port: Number(process.env.SQL_DB_PORT) || 5432,
  dialect: 'postgres',
  database: process.env.SQL_DB_NAME,
  username: process.env.SQL_DB_USER,
  password: process.env.SQL_DB_PASSWORD
});

import { SequelizeModelMap } from '@/types/constants/sequelize-model-map.constant';
import { registerSequelizeAssociations } from '@/helpers/sequelize-association.helper';

export async function checkSequelizeConnection() {
  try {
    await sequelizeClient.authenticate();

    // Register associations
    registerSequelizeAssociations();

    // Register models
    await Promise.all(Object.values(SequelizeModelMap).map((model) => model.sync()));

    console.log('Postgres connection has been established successfully.');
  } catch (error) {
    console.error('Unable to connect to postgres:', error);
    process.exit(1);
  }
}
