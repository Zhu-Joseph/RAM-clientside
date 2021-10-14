const knex = require("../db/connection")

function list() {
    return knex("reservations")
    .select("*")
}

function listDates(date) {
    return knex("reservations")
    .select("*")
    .where({"reservation_date": date})
    .whereNot({"status": "finished"})
    .whereNot({"status": "cancelled"})
    .orderBy("reservation_time")
}

function create(reservations) {
    return knex("reservations")
    .insert(reservations, "*")
    .then((createReservation) => createReservation[0])
}

function find(phone) {
    return knex("reservations")
    .select("*")
    .where("mobile_number", "like", `%${phone}%`)
}

function findId(id) {
    return knex("reservations")
    .select("*")
    .where({"id":id})
    .first()
}

function readTable(tableId){//FOR TABLES
    return knex("tables")
      .where({"id": tableId})
      .first();
}

function updateStatus(reservationId, newStatus) {
    return knex("reservations")
    .select("*")
    .where({"id": reservationId})
    .update({"status": newStatus})
}

function updateReservation(reservationId, update) {
    return knex("reservations")
    .select("*")
    .where({"id": reservationId})
    .update(update,"*")
} 

module.exports = {
    list,
    listDates,
    create,
    find,
    findId,
    updateStatus,
    updateReservation,
    readTable
}



