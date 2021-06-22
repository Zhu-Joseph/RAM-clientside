const knex = require("../db/connection")

function list() {
    return knex("tables")
    .select("*")
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

module.exports = {
    list,
    update,
    findTable,
    create
}