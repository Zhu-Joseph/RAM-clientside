/**
 * List handler for reservation resources
 */
const service = require("./reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")
const hardData = require("../db/seeds/00-reservations.json")

function validateReservation(req, res, next) {
  const data = req.body.data
  if (data.first_name === "" ||
  data.last_name  === ""||
  data.mobile_number === "" || 
  data.reservation_date === "" ||
  data.reservation_time === "" ||
  data.people < 1) {
    return next({ status: 400, 
      message: "Cannot complete a reservation unless all fields are complete"
    })
  }
  next()
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


//VALIDATION FOR DATE AND TIME
const dateFormat = /\d\d\d\d-\d\d-\d\d/;
const timeFormat = /\d\d:\d\d/;

function asDateString(date) {
  return `${date.getFullYear().toString(10)}-${(date.getMonth() + 1)
    .toString(10)
    .padStart(2, "0")}-${date.getDate().toString(10).padStart(2, "0")}`;
}

function formatAsDate(dateString) {
  return dateString.match(dateFormat)[0];
}

function formatAsTime(timeString) {
  return timeString.match(timeFormat)[0];
}

function today() {
  return asDateString(new Date());
}

function rightNow() {
  const now = new Date()
  const currentTime = `${('00' + now.getHours()).slice(-2)}:${('00' + now.getMinutes()).slice(-2)}:${now.getSeconds()}`
  return formatAsTime(currentTime)
}

function pastReservation(req, res, next) {//ACTUAL FUNCTION TO TEST RESERVATIONS
  const date = req.body.data.reservation_date
  const time = req.body.data.reservation_time

  if(date < today()) {
    return next({status: 400, message: "Cannot make reservations for a previous time or date"})
  }
  else if(date === today() && time < rightNow()) {
    return next({status: 400, message: "Cannot make reservations for a previous time or date"})
  }
  else {
    next()
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

async function find(req, res, next) {
  const phone = req.query.mobile_phone
  const content = phone ?
  await service.find(req.query.mobile_phone) :
  "No reservations found"

  res.json({
    data: content
  })
}


module.exports = {
  list: asyncErrorBoundary(list),
  create: [validateReservation, closedTuesdays, notOperatingHours, pastReservation, create]
};
