const service = require("./tables.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

function validateTable(req, res, next) {
    const data = req.body.data
    if(data.table_name.length < 2 || data.capacity < 1) {
        return next({ status: 400,
            message: "Please have a table name of at least two characters and a capacity of 1 or greater."})
    }
    next()
}

async function tableExist(req, res, next) {
    const tableId = req.params.table_id
    const foundTable = await service.findTable(tableId)

    if(!foundTable) {
        next({status:400, 
            message: "Table not found"
        })
    }
    next()
}

async function validSizeandTable(req, res, next) {
    const tableId = req.params.table_id
    const table = await service.findTable(tableId)
    const people = req.body.data.people

    if(table.occupied) {
        next({status:400, 
            message: "Sorry, the table you selected is currently occupied"
        })
    }
    else if(people > table.capacity) {
        next({status:400, 
            message: "Cannot make reservation, the party size is larger than the table capacity"
        })
    }
    next()
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

async function update(req, res, next) {
    const tableId = req.params.table_id
    const reservationId = req.body.data.id

    const updatedTable = await service.update(tableId, reservationId)

    res.json({data: updatedTable})
}

async function destroy(req, res, next) {
    const tableId = req.params.table_id
    const table = await service.findTable(tableId)
   
    if(!table.occupied) {
        next({status:400, 
            message: "The current table is not occupied"
        })
    } else {
        const data = await service.delete(tableId)
    }
    
    res.sendStatus(204)
}


module.exports = {
    list: asyncErrorBoundary(list),
    create: [validateTable, asyncErrorBoundary(create)],
    update: [tableExist, validSizeandTable ,asyncErrorBoundary(update)],
    delete: [tableExist, asyncErrorBoundary(destroy)]
    
}