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

function update(tableId, reservationId) {
    return knex("tables")
    .where({"id": tableId})
    .update({
        "occupied": true,
        "reservation_id": reservationId 
    })
}

function create(table) {
    return knex("tables")
    .insert(table, "*")
    .then((createTable) => createTable[0])
}

//TEST REQUIRE THAT WE USE A DELETE METHOD, BUT IT ACTUALLY ACTS MORE LIKE AN UPDATE
function destroy(tableId) {
    return knex("tables")
    .where({"id": tableId})
    .update({
        "occupied": false,
        "reservation_id": null 
    })
}

//TEST REQUIRE THAT I MAKE ONE METHOD TO BOTH UPDATE THE TABLE AND RESERVATION TABLES
function updateStatus(reservationId, newStatus) {//MAY NOT WORK
    return knex("reservations")
    .select("*")
    .where({"id": reservationId})
    .update({"status": newStatus})
}

//FROM MENTOR TEDDY
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
    update,
    findTable,
    create,
    delete: destroy,
    updateStatus,
    seat
}