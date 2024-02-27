/**
 * List handler for reservation resources
 */

const service = require("./reservations.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

function read(req, res) {
  const { reservation: data } = res.locals;
  res.status(200).json({ data });
}

// //check whether reservation exists
async function reservationExists(req, res, next) {
  const reservation = await service.read(req.params.reservation_id);
  if (reservation) {
    res.locals.reservation = reservation;
    return next();
  }
  next({ status: 404, message: `${req.params.reservation_id} cannot be found.` });
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
  const { data: {first_name, last_name, mobile_number, reservation_date, reservation_time, people} = {} } = req.body;
  
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
  
  if(dayOfWeek === 2) {
    return next({status: 400, message: `closed`})
  }
  next();
}



function reservationTimeisValid(req, res, next) {
  const reservationTimeString = req.body.data.reservation_time;
  const [reservationHour, reservationMinute] = reservationTimeString.split(':').map(Number);
 

  const reservationTime = new Date();
  reservationTime.setHours(reservationHour, reservationMinute, 0, 0);

  const openingTime = new Date();
  openingTime.setHours(10, 30, 0);

  const closingTime = new Date();
  closingTime.setHours(21, 30, 0);

  const currentTime = new Date();

  if (reservationTime < openingTime || reservationTime > closingTime) {
      return next({ status: 400, message: 'Reservation time must be between 10:30am and 9:30pm' });
  }

  if (reservationTime <= currentTime) {
      return next({ status: 400, message: 'Reservation time must be in the future' });
  }

  next();
}

module.exports = {
  list: asyncErrorBoundary(list),
  create: [validateReservation, reservationDateisValid, reservationTimeisValid, asyncErrorBoundary(create),],
  read: [reservationExists, read,],
}
