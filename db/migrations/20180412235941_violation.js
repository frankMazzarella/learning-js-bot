exports.up = (knex, Promise) => Promise.all([
  knex.schema.createTable('teams', (table) => {
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
  knex.schema.dropTable(('teams')),
  knex.schema.dropTable(('violation')),
]);

