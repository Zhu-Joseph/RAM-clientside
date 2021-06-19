import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from "react-router-dom"
import {listTables} from "../utils/api"

export default function ReservationSeats() {
    const [tables, setTables] = useState([])
    const [tableError, setTableError] = useState(null);
    const [reservationTable, setReservationTable] = useState(1)
    const {reservation_id} = useParams()

    const history = useHistory()
    const url = "http://localhost:5000/tables"
    useEffect(loadTables, [])

    function loadTables() {
        const abortController = new AbortController();
        setTableError(null)
        fetch(url)
        .then((response => response.json()))
        .then((table => setTables(table.data)))
        .catch(setTableError)
        return () => abortController.abort();
      }

    function handleSubmit(event) {
        event.preventDefault()
        const abortController = new AbortController()
        console.log(event.target)
    }

    function handleChange({target}) {
        const value = target.value
        setReservationTable(value)
    }
    console.log(reservationTable)
    function cancelHandler() {
        history.goBack()
    }

    if(tables) {
        const list = tables.map((table) => {
            return (
                <option key={table.id} value={`${table.capacity}`}>
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