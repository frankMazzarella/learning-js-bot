exports.up = (knex) => {
  return knex.schema.createTable('violations', (table) => {
    table.increments();
    table.string('user');
    table.timestamps();
  });
};

exports.down = (knex, Promise) => {
  return knex.schema.dropTable('violations');
};
