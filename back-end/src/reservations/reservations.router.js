/**
 * Defines the router for reservation resources.
 *
 * @type {Router}
 */

const router = require("express").Router();
const controller = require("./reservations.controller");

router.route("/:reservation_id/edit")//MAY NOT NEED
    .get(controller.findId)

router.route("/:reservation_id/status")
    .put(controller.updateStatus)

router.route("/:reservation_id/seat")
    .get(controller.findId)

router.route("/:reservation_id")
    .put(controller.updateReservation)
    .get(controller.read)

router.route("/")
    .post(controller.create)
    .get(controller.list)
    

module.exports = router;
