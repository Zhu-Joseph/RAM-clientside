import React from "react"
import {deleteTable, updateStatus} from "../utils/api";

export default function Tables (props) {
    const {table} = props
    const table_id = table.id//TO MAKE SURE TEST PASSES AND RUNS

    return (
        <li key={table_id}>
          Table: {table.table_name} Status: {
          table.occupied ? <div>"Occupied"<button data-table-id-finish={table.table_id} onClick={(() => {
            const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.")

            if(result) {
              const abortController = new AbortController();
              updateStatus(table.reservation_id, {data: {"status": "finished"}}, abortController.signal)
              deleteTable(table_id)              
              .then(props.loadTables)
              .then(props.loadDashboard)
              .catch(props.setReservationsError)
            }
          })}>Finish</button></div>:
           "Free" 
          }
        </li>
      )
}