/**
 * List handler for reservation resources
 */
const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

const timeFormat = /\d\d:\d\d/;

function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

function formatAsTime(timeString) {
  return timeString.match(timeFormat)[0];
}

function rightNow() {
  const now = new Date()
  const currentTime = `${('00' + now.getHours()).slice(-2)}:${('00' + now.getMinutes()).slice(-2)}:${now.getSeconds()}`
  return formatAsTime(currentTime)
}

function today() {
  return asDateString(new Date());
}

function dayofweek(y, m, d)//TO CHECK FOR TUESDAY = 2, [0-6] = SUN-SAT
{// HELPER FUNCTION FOR VALIDATE RESERVATION
    let t = [ 0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4 ];
    y -= (m < 3) ? 1 : 0;
    return ( y + y/4 - y/100 + y/400 + t[m-1] + d) % 7;
}

function closedTuesdays(req, res, next) {
  const data = req.body.data.reservation_date
  const date = data.split("-")
  const checkTuesday = Math.round(dayofweek(
      Number(date[0]), Number(date[1]), Number(date[2])
      ))
  
  if(checkTuesday === 2) {
    return next ({status: 400,
    message: "Sorry, the resturant is closed on Tuesdays"
    })
  }
  next()
}

function isValidDate(req, res, next){
  const { data = {} } = req.body;
  const date = data['reservation_date']
  const time = data['reservation_time']

  if (isNaN(Date.parse(data['reservation_date']))){
      return next({ status: 400, message: `Invalid reservation_date` });
  }
  if(date < today()) {
    return next({status: 400, message: "Reservation must be set in the future"})
  }
  if(date === today() && time < rightNow()) {
    return next({status: 400, message: "Reservation must be set in the future"})
  }
  next();
}

//TIME AND DATE VALIDATION FUNCTION ABOVE
function bodyDataHas(propertyName) {
  return function (req, res, next) {
    const { data = {} } = req.body;
    if (data[propertyName]) {
      return next();
    }
    next({ status: 400, message: `Must include a ${propertyName}` });
  };
}

const has_id = bodyDataHas("id")

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
  const people = data["people"]

  if (people === 0 || !Number.isInteger(people)){
      return next({ status: 400, message: `Invalid number of people` });
  }
  next();
}

function notOperatingHours(req, res, next) {
  const data = req.body.data.reservation_time
 
  if(data < "10:30" ) {
    return next({status: 400, message: "Please make a reservation during our operating hours"})
  } 
  else if(data > "21:30" ) {
    return next({status: 400, message: "Sorry, we are unable to make reservations one hour before closing time"})
  }
  next()
}

async function reservationExist(req, res, next) {
  const id = req.params.reservation_id
  const foundReservation = await service.findId(id)

  if(!foundReservation) {
    next({status: 404, message: `Sorry we could not locate your reservation ${id}` })
  }
  res.locals.reservation = foundReservation//THIS LINE WAS ADDED FROM MY ORIGINAL CODE
  next()
}

function validStatus(req, res, next) {
  const newStatus = req.body.data.status

  if(newStatus !== "booked" && newStatus !== "seated" && newStatus !== "finished" && newStatus !== "cancelled") {
    next({status: 400, message: `${newStatus} is an invalid reservation status`})
  }
  next()
}

function notFinished(req, res, next) {
  const currentStatus = res.locals.reservation.status

  if(currentStatus === "finished") {
    next({ status: 400, message: `Reservation is already ${currentStatus}`})
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

async function findResv(req, res, next) {
  const id = req.body.data.id
  const foundReservation = await service.findId(id)

  if(!foundReservation) {
    next({status: 404, message: `Sorry we could not locate your ${id}`})
  }

  next()
}

async function notYetSeated(req, res, next) {
  const id = req.body.data.id

  const foundReservation = await service.findId(id)
  res.locals.reservation = foundReservation
  
  if(foundReservation.status === "seated") {
    next({status: 400, message: `Sorry the current reservation is already ${foundReservation.status}`})
  }

  next()
}

async function validSizeandTable(req, res, next) {
  const id = req.body.data.id
  const tableId = req.params.table_id

  const foundReservation = await service.findId(id)
  const foundTable = await service.readTable(tableId)

  if(foundReservation.people > foundTable.capacity) {
    next({status: 400, message: `Party size is greater then table capacity`})
  }
  next()
}

function isBooked(req, res, next) {

  if (req.body.data.status === "booked") {
    next();
  } else {
    next({
      status: 400,
      message: `Reservation is ${req.body.data.status}.`,
    });
  }
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
  const body = req.body.data
  const newStatus = req.body.data.status

  const updatedReservation = await service.updateStatus(id, newStatus)
  
  res.json({data: body})
}

async function updateReservation(req, res, next) {
  const id = req.params.reservation_id
  const update = req.body.data
  const updatedReservation = await service.updateReservation(id, update)

  res.json({data: update})
}

async function read(req, res) {
  const data = res.locals.reservation;
  res.status(200).json({
    data,
  })
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
    closedTuesdays,
    notOperatingHours,
    isBooked,
    asyncErrorBoundary(create)
  ],
  validResv: [
    has_id,
    findResv, 
    notYetSeated, 
    validSizeandTable
  ],
  read: [reservationExist, asyncErrorBoundary(read)],
  updateStatus: [
    reservationExist,
    notFinished, 
    validStatus,
    asyncErrorBoundary(updateStatus)],
  updateReservation: [
    has_first_name,
    has_last_name,
    has_mobile_number,
    has_reservation_date,
    has_reservation_time,
    has_people,
    has_people,
    isValidDate,
    isValidNumber,
    isTime,
    reservationExist, 
    bookedOnly, 
    validStatus, 
    asyncErrorBoundary(updateReservation)
  ]
};
