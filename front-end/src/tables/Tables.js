import React from "react"
import {deleteTable, updateStatus} from "../utils/api";

export default function Tables (props) {
    const {table} = props
    const table_id = table.id//TO MAKE SURE TEST PASSES AND RUNS

    return (
        <li key={table_id}>
          Table: {table.table_name} Status: {
          table.occupied ? <>"Occupied"<button data-table-id-finish={table.table_id} class="btn btn-danger"
          
          onClick={(() => {
            const result = window.confirm("Is this table ready to seat new guests? This cannot be undone.")

            //FOR THE PURPOSES OF THIS PROJECT, I AM USING A DELETE METHOD.
            //HOWEVER UPDATING THE TABLE TO UNOCCUPIED WOULD BE MORE PRACTICAL SINCE YOU WOULDN'T NEED TO REMAKE A NEW TABLE
            if(result) {
              const abortController = new AbortController();
              updateStatus(table.reservation_id, {data: {"status": "finished"}}, abortController.signal)
              deleteTable(table_id)              
              .then(props.loadTables)
              .then(props.loadDashboard)
              .catch(props.setReservationsError)
            }
          })}>Finish</button></>:
           "Free" 
          }
        </li>
      )
}