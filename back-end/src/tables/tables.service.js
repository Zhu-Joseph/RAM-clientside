const knex = require("../db/connection")

function list() {
    return knex("tables")
    .select("*")
    .orderBy("table_name")
}

function findTable (tableId) {
    return knex("tables")
    .select("*")
    .where({"id": tableId})
    .first()
}

function create(table) {
    return knex("tables")
    .insert(table, "*")
    .then((createTable) => createTable[0])
}

//TEST REQUIRE THAT WE USE A DELETE METHOD, BUT IT ACTUALLY ACTS MORE LIKE AN UPDATE
function destroy(tableId, reservationId) {
    return knex.transaction(async (transaction) => {
        await knex("reservations")
            .where({"id": reservationId })
            .update({ status: "finished" })
            .transacting(transaction);

    return knex("tables")
        .where({"id": tableId})
        .update({
            "occupied": false,
            "reservation_id": null 
        })
    })
}

function seat(table_id, reservation_id) {
    return knex.transaction(async (transaction) => {
      await knex("reservations")
        .where({"id": reservation_id })
        .update({ status: "seated" })
        .transacting(transaction);

      return knex("tables")
        .where({ "id": table_id })
        .update({
            "occupied": true,
            "reservation_id": reservation_id 
        })
        .transacting(transaction)
        .then((records) => records[0]);
    });
}

module.exports = {
    list,
    findTable,
    create,
    delete: destroy,
    seat
}