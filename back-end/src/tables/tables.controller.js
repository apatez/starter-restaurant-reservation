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
    const { data: {table_name, capacity} = {} } = req.body;

     if(!table_name || table_name.length === 0 || table_name.length === 1){
      return next({ status: 400, message: `table_name is incorrect`})
     }

     if(!capacity || capacity === 0 || !Number.isInteger(capacity)){
      return next({ status: 400, message: `capacity is incorrect`})
     }
     next();
  }

  async function tableExists(req, res, next) {
    const { tableId } = req.params;
    const table = await service.read(tableId)
    if(table) {
      res.locals.table = table;
      return next();
    }
    next({ status: 404, message: `${tableId} cannot be found`})
  }

  function hasRequiredProperties(req, res, next) {
    const { data: {reservation_id, capacity} = {}} = req.body;

    if(!reservation_id) {
      return next({ status: 400, message: `reservation_id is incorrect`})
    }

    if(!capacity){
      return next({ status: 400, message: `capacity is incorrect`})
    }

    next();
  }

  async function update(req, res, next){
    const updatedTable = {
      ...req.body.data,
      table_id: res.locals.table.table_id,
    };
   const data = await service.update(updatedTable)
   res.json({ data })
  }

  async function destroy(req, res) {
    const { table } = res.locals;
    await service.delete(table.table_id);
    res.sendStatus(204);
  }

  module.exports = {
    list: asyncErrorBoundary(list),
    create: [validateTable, asyncErrorBoundary(create)],
    update: [hasRequiredProperties, asyncErrorBoundary(tableExists), asyncErrorBoundary(update)],
    delete: [asyncErrorBoundary(tableExists), asyncErrorBoundary(destroy)],
  }