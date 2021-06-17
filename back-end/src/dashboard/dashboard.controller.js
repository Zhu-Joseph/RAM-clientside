// const service = require("./dashboard.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const reservationService = require("../reservations/reservations.service")//NOTE THIS IS FROM RESERVATIONS

async function list(req, res) {
    const data = await reservationService.list()

    res.json({ data})
}

module.exports = {
    list: asyncErrorBoundary(list)
}