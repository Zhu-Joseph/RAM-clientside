import React from "react"
import {deleteTable, updateStatus} from "../utils/api";

export default function Tables (props) {
    const {table} = props
    const table_id = table.id//TO MAKE SURE TEST PASSES AND RUNS

    function finishHandler() {
      const abortController = new AbortController();
      const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.")

      if(result) {
        updateStatus(table.reservation_id, {data: {"status": "finished"}}, abortController.signal)
        deleteTable(table_id)              
        .then(props.loadTables)
        .then(props.loadDashboard)
        .catch(props.setReservationsError)
      }
    }

    return (
      <div>
        {table.occupied ? 
          <li key={table_id} className="list-group-item list-group-item-warning">
            Table: {table.table_name} 
            <span className="col-md">Status:</span> 
              Occupied
              <button data-table-id-finish={table.table_id} className="btn btn-danger"
              onClick={finishHandler}>
                Finish
              </button>
            
          </li> : 

          <li key={table_id} className="list-group-item list-group-item-success">
            Table: {table.table_name}
            <span className="col-md">Status:</span> 
            <span className="col">Free</span> 
          </li>
        }
      </div>
    )
}