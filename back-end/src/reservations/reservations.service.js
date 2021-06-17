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

module.exports = {
    list,
    listDates,
    create,
    find
}



