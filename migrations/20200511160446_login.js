exports.up = function(knex) {
    return knex.schema.createTable('login', function(table) {
      table.increments();
      table.string('email').notNullable();
      table.text('hash').notNullable();
    })
  }
  
exports.down = function(knex) {
    return knex.schema.dropTable('login');
}