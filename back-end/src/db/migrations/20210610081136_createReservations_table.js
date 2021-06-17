
exports.up = function(knex) {
    knex.schema.createTable("reservations", (table) => {
      table.increments("id").primary()
      table.string("first_name",15).notNullable()
      table.string("last_name",15).notNullable()
      table.string("mobile_number",12).notNullable()
      table.date("reservation_date").notNullable()
      table.time("reservation_time").notNullable()
      table.integer("people").notNullable()
      table.timestamps(true, true)
    })
  }

exports.down = function(knex) {
  return knex.schema.dropTable("reservations")
};
