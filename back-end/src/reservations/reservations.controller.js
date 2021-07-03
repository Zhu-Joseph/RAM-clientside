/**
 * List handler for reservation resources
 */
const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

function isValidDate(req, res, next){
  const { data = {} } = req.body;
  const reservation_date = new Date(data['reservation_date']);
  const day = reservation_date.getDate();
  console.log(day)
  console.log(reservation_date)
  if (isNaN(Date.parse(data['reservation_date']))){
      return next({ status: 400, message: `Invalid reservation_date` });
  }
  if (day === 2) {
      return next({ status: 400, message: `Restaurant is closed on Tuesdays` });
  }
  if (reservation_date < new Date()) {
      return next({ status: 400, message: `Reservation must be set in the future` });
  }
  next();
}

function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

const has_first_name = bodyDataHas("first_name");
const has_last_name = bodyDataHas("last_name");
const has_mobile_number = bodyDataHas("mobile_number");
const has_reservation_date = bodyDataHas("reservation_date");
const has_reservation_time = bodyDataHas("reservation_time");
const has_people = bodyDataHas("people");

function isTime(req, res, next){
  const { data = {} } = req.body;
  if (/^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]$/.test(data['reservation_time']) || /^(0[0-9]|1[0-9]|2[0-3]):[0-5][0-9]:[0-5][0-9]$/.test(data['reservation_time']) ){
    return next();
  }
  next({ status: 400, message: `Invalid reservation_time` });
}

function isValidNumber(req, res, next){
  const { data = {} } = req.body;
  const people = Number(data["people"])

  if (people === 0 || !Number.isInteger(people)){
      return next({ status: 400, message: `Invalid number of people` });
  }
  next();
}

async function reservationExist(req, res, next) {
  const id = req.params.reservation_id
  const foundReservation = await service.findId(id)

  if(!foundReservation) {
    next({status: 400, message: "Sorry we could not locate your reservation"})
  }
  next()
}

function validStatus(req, res, next) {
  const newStatus = req.body.data.status

  if(newStatus !== "booked" && newStatus !== "seated" && newStatus !== "finished" && newStatus !== "cancelled") {
    next({status: 400, message: "Invalid reservation status"})
  }
  next()
}

async function bookedOnly(req, res, next) {
  const id = req.params.reservation_id
  const foundReservation = await service.findId(id)

  if(foundReservation.status !== "booked") {
    next({status: 400, message: "Sorry we can only edit reservations that are currently booked and not yet seated"})
  }
  next()
}


//VALIDATION AND HELPER FUNCTIONS ABOVE, CRUD FUNCTIONS BELOW
async function list(req, res) {
  const date = req.query.date
  const phone = req.query.mobile_phone

  if(phone) {
    const data = await service.find(phone)
    if(data.length === 0) {
      res.json({data: []})
    }
    res.json({data})
  }
  else if(date) {
    const data = await service.listDates(date)
    res.json({data})
  } 
  else {
    const data = await service.list()
    res.json({data})
  }
}

async function create(req, res, next) {
  const data = await service.create(req.body.data)
  res.status(201).json({data})
}

async function findId(req, res, next) {
  const id = req.params.reservation_id
  const people = await service.findId(id)

  res.json({data: people})
}

async function updateStatus(req, res, next) {
  const id = req.params.reservation_id
  const newStatus = req.body.data.status
  const updatedReservation = await service.updateStatus(id, newStatus)

  res.json({data: updatedReservation})
}

async function updateReservation(req, res, next) {
  const id = req.params.reservation_id
  const update = req.body.data
  const updatedReservation = await service.updateReservation(id, update)

  res.json({data: updatedReservation})
}


module.exports = {
  list: asyncErrorBoundary(list),
  findId,
  create: [
    has_first_name,
    has_last_name,
    has_mobile_number,
    has_reservation_date,
    has_reservation_time,
    has_people,
    isValidDate,
    isValidNumber,
    isTime,
    create
  ],
  updateStatus: [reservationExist, validStatus, asyncErrorBoundary(updateStatus)],
  updateReservation: [reservationExist, bookedOnly, validStatus, asyncErrorBoundary(updateReservation)] 
};
