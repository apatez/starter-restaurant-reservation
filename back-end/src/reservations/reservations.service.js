const knex = require("../db/connection");

function read(reservationId) {
  console.log({reservationId})
    return knex("reservations")
    .select("*")
    .where({ reservation_id: reservationId})
    .first()
}

//GET reservations by date
function list(reservationDate) {
  return knex("reservations")
    .select("*")
    .where({ reservation_date: reservationDate })
    .orderBy("reservation_time");
}

function create(reservation) {
  return knex("reservations")
    .insert(reservation)
    .returning("*")
    .then((created) => created[0]);
}

module.exports = {
  read,
  list,
  create,
};
