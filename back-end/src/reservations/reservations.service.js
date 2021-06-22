const knex = require("../db/connection")

function list() {
    return knex("reservations")
    .select("*")
}

function listDates(date) {
    return knex("reservations")
    .select("*")
    .where({"reservation_date": date})
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
    .where({"mobile_number": phone})
}

function findResvSize(id) {
    return knex("reservations")
    .select("people")
    .where({"id": id})
}

function findId(id) {
    return knex("reservations")
    .select("*")
    .where({"id":id})
    .first()
}

module.exports = {
    list,
    listDates,
    create,
    find,
    findResvSize,
    findId
}



