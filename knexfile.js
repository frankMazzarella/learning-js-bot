require('dotenv').config();
const path = require('path');

const dbConfiguration = {
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
  migrations: { directory: path.join(__dirname, '/db/migrations') },
};

module.exports = {
  development: dbConfiguration,
  staging: dbConfiguration,
  production: dbConfiguration,
};
