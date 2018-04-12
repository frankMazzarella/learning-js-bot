require('dotenv').config();

const dbConfiguration = {
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  migrations: { directory: './db/migrations' },
};

module.exports = {
  development: dbConfiguration,
  staging: dbConfiguration,
  production: dbConfiguration,
};
