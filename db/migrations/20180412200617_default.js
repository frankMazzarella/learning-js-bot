exports.up = (knex) => {
  return knex.schema.createTable('violations', (table) => {
    table.increments().primary();
    table.string('user');
    table.string('channel');
    table.string('message');
    table.timestamp('created_at').defaultTo(knex.fn.now());
    table.timestamp('updated_at').defaultTo(knex.fn.now());
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('violations');
};
