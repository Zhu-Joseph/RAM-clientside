const knex = require("../db/connection")

function list() {
    return knex("tables")
    .select("*")
}

function update(id) {
    return knex("tables")
    .where({"table_name": "Bar #2"})
    .update({
        "occupied": true,
        "reservation_id": id 
    })
}




module.exports = {
    list,
    update,
}