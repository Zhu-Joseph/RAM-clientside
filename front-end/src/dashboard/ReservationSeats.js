import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from "react-router-dom"
import {updateTable} from "../utils/api"

export default function ReservationSeats() {
    const [tables, setTables] = useState([])
    const [tableError, setTableError] = useState(null);
    const [reservationTable, setReservationTable] = useState(1)
    const [resvSize, setResvSize] = useState([])
    const {reservation_id} = useParams()
    const history = useHistory()
    const url = "http://localhost:5000/tables"
    const url2 = `http://localhost:5000/reservations/${reservation_id}/seat`

    useEffect(loadTables, [])
    useEffect(getResvSize, [])

    function loadTables() {
        const abortController = new AbortController();
        setTableError(null)
        fetch(url)
        .then((response => response.json()))
        .then((table => setTables(table.data)))
        .catch(setTableError)
        return () => abortController.abort();
      }

    function getResvSize() {
        const abortController = new AbortController()
        fetch(url2)
        .then((response => response.json()))
        .then((table => setResvSize(table.data)))
        .catch(setTableError)
        return () => abortController.abort();
    }

    console.log(`Table size ${reservationTable[2]} and Id ${reservationTable[0]}`)
    console.log(`Reservation size ${resvSize.people} and Id ${resvSize.id}`)

    function handleSubmit(event) {
        event.preventDefault()
        const abortController = new AbortController()

        if(resvSize.people > reservationTable[2] ) {
            window.alert(`Reservation is for ${resvSize.people} while the table only holds ${reservationTable[2]}. 
Please choose another table.`)
        }
        
        else {
            // const tableId = reservationTable[0]
            // updateTable(tableId, resvSize.id, abortController)
            console.log("workingish")
        }

    }

    function handleChange({target}) {
        const value = target.value
        setReservationTable(value)
    }

    function cancelHandler() {
        history.goBack()
    }

    if(tables) {
        const list = tables.map((table) => {
            return (
                <option key={table.id} value={[table.id, table.capacity]}>
                    Table: {table.table_name} - Capacity: {table.capacity}
                </option>
            )
        })
        return (
            <div>
                <form onSubmit={handleSubmit}>
                    <select value={reservationTable} onChange={handleChange} >
                        {list}
                    </select>
                    <button onSubmit={handleSubmit}>Submit</button> 
                    <button>Cancel</button>
                </form>
            </div>
        )
    }

    return (
        <div>
            Loading Table Seating...
        </div>
    )
}