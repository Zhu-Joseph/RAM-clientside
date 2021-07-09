const router = require("express").Router()
const controller = require("./tables.controller")
const reservationController = require("../reservations/reservations.controller")

router.route("/:table_id/seat")
    // .put(controller.update)
    .put(reservationController.validResv, controller.update)
    .delete(controller.delete).all()

router.route("/")
    .post(controller.create)
    .get(controller.list)

module.exports = router