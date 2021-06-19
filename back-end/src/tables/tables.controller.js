const service = require("./tables.service")
const resvService = require("../reservations/reservations.service")
const asyncErrorBoundary = require("../errors/asyncErrorBoundary")

async function validateSize(req, res, next) {
    const phone = req.params.table_id
    const findResv = await resvService.findResvSize(phone)
    //FINDS THE NUMBER OF PEOPLE IN THE RESERVATION
    //SHOULD THEN FIND THE CAPACITY OF THE TABLE THEY'RE TRYING TO USE
    //COMPARES THE TWO, IF PEOPLE <= CAPACITY THEN NEXT()
    //ELSE RETURN AN ERROR AND 400 STATUS
    next()
}


//VALIDATION AND HELPER FUNCTIONS ABOVE, CRUD FUNCTIONS BELOW
async function list(req, res) {
    const data = await service.list()    
    res.json({data})
}

async function update(req, res, next) {
    const phone = req.params.table_id
    const updatedTable = await service.update(phone)

    res.json({data: updatedTable})
}


module.exports = {
    list: asyncErrorBoundary(list),
    update: [validateSize, asyncErrorBoundary(update)]
}