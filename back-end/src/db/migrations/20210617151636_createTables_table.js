
exports.up = function(knex) {
  return knex.schema.createTable("tables", (table) => {
      table.increments("id").primary()
      table.string("table_name",15).notNullable()
      table.integer("capacity").notNullable()
      table.boolean("occupied").notNullable()
      table.integer("reservation_id")
      table.timestamps(true,true)
      table.foreign("reservation_id").references("id").inTable("reservations")
  })
};

exports.down = function(knex) {
  return knex.schema.dropTable("tables")
};
