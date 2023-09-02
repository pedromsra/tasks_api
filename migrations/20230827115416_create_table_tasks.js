
exports.up = function(knex, Promise) {
  return knex.schema.createTable('tasks', table => {
    table.increments('id').primary()
    table.string('description').notNull()
    table.datetime('estimate_at')
    table.datetime('done_at')
    table.integer('user_id').references('id')
      .inTable('users').notNull()
  })
};

exports.down = function(knex, Promise) {
  return knex.schema.dropTable('tasks')
};
