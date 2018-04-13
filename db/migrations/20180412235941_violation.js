exports.up = (knex) => {
  return knex.schema.createTable('violation', (table) => {
    table.increments();
    table.string('user').notNullable();
    table.string('channel').notNullable();
    table.text('message');
    table.timestamps(true, true);
  });
};

exports.down = (knex) => {
  return knex.schema.dropTable(('violation'));
};
