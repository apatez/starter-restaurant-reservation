const service = require("./tables.service");
const asyncErrorBoundary = require("../errors/asyncErrorBoundary");

async function list(req, res) {
    const data = await service.list();
    res.json({ data });
  }

  async function create(req, res, next) {
    const data = await service.create(req.body.data)
    res.status(201).json({ data });
  }

  function validateTable(req, res, next) {
    const { data } = req.body;
    const { table_name, capacity } = data;
  

    if (!data){
      return next({ status: 400, message: `data is missing`})
     }

     if(!table_name || table_name.length === 0 || table_name.length === 1){
      return next({ status: 400, message: `table_name is incorrect`})
     }

     if(!capacity || capacity === 0 || !Number.isInteger(capacity)){
      return next({ status: 400, message: `capacity is incorrect`})
     }
     next();
  }

  module.exports = {
    list: asyncErrorBoundary(list),
    create: [validateTable, asyncErrorBoundary(create),],
  }