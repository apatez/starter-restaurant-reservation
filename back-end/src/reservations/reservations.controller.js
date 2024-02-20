/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function read(req, res) {
  const { reservation: data } = res.locals;
  res.josn({ data });
}

// //check whether reservation exists
async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservationId);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `Reservation cannot be found.` });
}


//GET /dashboard?date
async function list(req, res) {
  const { date } = req.query;
  const data = await service.list(date);
  res.json({ data });
}

async function create(req, res, next) {
  const data = await service.create(req.body.data)
  res.status(201).json({ data });
}

function validateReservation(req, res, next) {
  const { data } = req.body;
  const { first_name, last_name, mobile_number, reservation_date, reservation_time, people } = data;
  const valid = ["first_name", "last_name", "mobile_number", "reservation_date", "reservation_time", "people"]
  if (!req.body.data){
   return next({ status: 400, message: `data is missing`})
  }
  
  if (!first_name || first_name.length === 0) {
    return next({ status: 400, message: `first_name is missing`})
  }
  
  if (!last_name || last_name.length === 0) {
    return next({ status: 400, message: `last_name is missing`})
  }

  if (!mobile_number || mobile_number.length === 0) {
    return next({ status: 400, message: `mobile_number is missing`})
  }
   
  if (!reservation_date || reservation_date.length === 0 || !/\d{4}-\d{2}-\d{2}/.test(reservation_date) ) {
    return next({ status: 400, message: `reservation_date is missing`})
  }

  if (!reservation_time || reservation_time.length === 0 || !/[0-9]{2}:[0-9]{2}/.test(reservation_time) ) {
    return next({ status: 400, message: `reservation_time is missing`})
  }

  if (!people || people.length === 0 || typeof people !== 'number' ) {
    return next({ status: 400, message: `people is missing`})
}
next();
}

function reservationDateisValid(req, res, next) {
  const { reservation_date } = req.body.data;
  const date = new Date(reservation_date);
  const current = new Date();

  if(date < current){
    return next({status: 400, message: `reservation_date occurs in the future`})
  }

  const dayOfWeek = new Date(reservation_date + ":00:00:00").getDay();
  console.log(dayOfWeek)
  
  if(dayOfWeek === 2) {
    return next({status: 400, message: `closed`})
  }
  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validateReservation, reservationDateisValid, asyncErrorBoundary(create),],
}
