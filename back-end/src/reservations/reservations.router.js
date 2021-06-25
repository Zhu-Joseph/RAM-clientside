/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/:reservation_id/edit")
    .put(controller.updateReservation)
    .get(controller.findId)

router.route("/:reservation_id/status")
    .put(controller.updateStatus)

router.route("/:reservation_id/seat")
    .get(controller.findId)

router.route("/")
    .post(controller.create)
    .get(controller.list)
    

module.exports = router;
