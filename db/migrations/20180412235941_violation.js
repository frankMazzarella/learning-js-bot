exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('team', (table) => {
    table.string('teamId').notNullable();
    table.string('token').notNullable();
    table.timestamps(true, true);
  }),
  knex.schema.createTable('violation', (table) => {
    table.increments();
    table.string('user').notNullable();
    table.string('channel').notNullable();
    table.text('message');
    table.timestamps(true, true);
  }),
]);

exports.down = (knex, Promise) => Promise.all([
  knex.schema.dropTable(('team')),
  knex.schema.dropTable(('violation')),
]);

