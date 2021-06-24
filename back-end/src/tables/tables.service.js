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

function destroy(tableId) {
    return knex("tables")
    .where({"id": tableId})
    .del()
}

module.exports = {
    list,
    update,
    findTable,
    create,
    delete: destroy
}