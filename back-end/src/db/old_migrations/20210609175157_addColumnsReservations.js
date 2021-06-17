
exports.up = function(knex) {
  knex.schema.alterTable("reservations", (table) => {
    table.renameColumn("reservation_id", "id")
    table.string("first_name",30).notNullable()
    table.string("last_name",30).notNullable()
    table.string("mobile_number",12).notNullable()
    table.date("reservation_date").notNullable()
    table.time("reservation_time").notNullable()
    table.integer("people").notNullable()
  })
}

// exports.down = function(knex) {
//   return knex.schema.table("reservations", (table) => {
//       table.renameColumn("reservation_id", "id")
//       table.dropColumn("first_name")
//       table.dropColumn("last_name")
//       table.dropColumn("mobile_number")
//       table.dropColumn("reservation_date")
//       table.dropColumn("reservation_time")
//       table.dropColumn("people")
//   })
// };
exports.down = function (knex) {
    return knex.schema.dropTable("reservations");
  };
