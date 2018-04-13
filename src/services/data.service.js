const knex = require('knex');

const db = knex({
  client: 'mysql',
  connection: {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  },
});

module.exports.db = db;

module.exports.tables = {
  VIOLATIONS: 'violations',
};
