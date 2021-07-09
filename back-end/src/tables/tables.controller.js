const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

function bodyDataHas(propertyName) {
    return function (req, res, next) {
      const { data = {} } = req.body;
      if (data[propertyName]) {
        return next();
      }
      next({ status: 400, message: `Must include a ${propertyName}` });
    };
}

const has_table_name = bodyDataHas("table_name");
const has_capacity = bodyDataHas("capacity");

function isValidTableName(req, res, next){
    const { data = {} } = req.body;
    const tableName = data['table_name']

    if (tableName.length < 2){
        return next({ status: 400, message: `table_name length is too short.` });
    }
    next();
}
  
function isValidNumber(req, res, next){
    const { data = {} } = req.body
    const capacity = data['capacity']

    if ('capacity' in data){
        if (capacity === 0 || !Number.isInteger(capacity)){
            return next({ status: 400, message: `capacity must be a number.` });
        }
    }
    next();
}

async function tableExist(req, res, next) {
    const tableId = req.params.table_id
    const foundTable = await service.findTable(tableId)

    if(!foundTable) {
        next({ status: 404, 
            message: `No such table: ${tableId}`
        })
    }
    res.locals.table = foundTable
    next()
}

function isAvailable(req, res, next) {

    if (res.locals.table.reservation_id) {
      next({
        status: 400,
        message: `Table id is occupied: ${res.locals.table.id}`,
      });
    } else {
      next();
    }
  }
  
//VALIDATION AND HELPER FUNCTIONS ABOVE, CRUD FUNCTIONS BELOW
async function list(req, res) {
    const data = await service.list()    
    res.json({data})
}

async function create(req, res, next) {
    const data = await service.create(req.body.data)
    res.status(201).json({data})
}

async function seat(req, res, next) {
    const tableId = res.locals.table.id
    const data = await service.seat(tableId, res.locals.reservation.id);

    res.json({data})
}

async function destroy(req, res, next) {
    const table = res.locals.table

    res.locals.table = null
    if(!table.occupied) {
        next({status:400, 
            message: "The current table is not occupied"
        })
    } else {
        const data = await service.delete(table.id, table.reservation_id)
    }
    
    res.json({data: "Reservation was finished"})
}

module.exports = {
    list: asyncErrorBoundary(list),
    create: [
        has_table_name, 
        has_capacity, 
        isValidTableName, 
        isValidNumber, 
        asyncErrorBoundary(create)
    ],
    update: [
        tableExist, 
        isAvailable, 
        asyncErrorBoundary(seat)
    ],
    delete: [tableExist, asyncErrorBoundary(destroy)]
}