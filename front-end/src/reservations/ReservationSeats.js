import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"
import {updateStatus, updateTable, listReservationSeat, listTables} from "../utils/api"

export default function ReservationSeats() {
    const [tables, setTables] = useState([])
    const [error, setError] = useState(null);
    const [reservationTable, setReservationTable] = useState("")
    const [reservation, setReservation] = useState([])
    const [updateInfo, setUpdateInfo] = useState({})
    const {reservation_id} = useParams()
    const history = useHistory()

    useEffect(loadTables, [])
    useEffect(getReservation, [])

    function loadTables() {
        const abortController = new AbortController()
        setError(null)
        listTables()
            .then((tables) => {
                const info = tables.data
                setTables(info)
                setUpdateInfo(info[0])
                setReservationTable(`${info[0].id} ${info[0].capacity}`)
            })
            .catch(setError)

        return () => abortController.abort()
    }

    function getReservation() {
        const abortController = new AbortController()
        listReservationSeat(reservation_id, ({id: reservation_id}), abortController.signal)
            .then(setReservation)
            .catch(setError)
        return () => abortController.abort();
    }

    function handleSubmit(event) {
        event.preventDefault()

        const abortController = new AbortController()

        if(reservation.people > updateInfo.capacity) {
            window.alert(`Reservation is for ${reservation.people} while the table only holds ${updateInfo.capacity}. 
Please choose another table.`)
        }
        
        else {
            const tableId = updateInfo.id
            updateTable(tableId, {data: reservation}, abortController.signal)
                .then(() => {
                    updateStatus(reservation_id, {data: {"status": "seated"}}, abortController.signal)
                })
                .then(() => {
                    history.push("/dashboard")
                })
                .catch(setError)
        }
    }

    function handleChange({target}) {
        const value = target.value
        const putBody = value.split(" ")
 
        setReservationTable(value)
        setUpdateInfo({"id": putBody[0], "capacity": putBody[1]})
    }

    function cancelHandler() {
        history.goBack()
    }
    
    if(error) {
        return (
            <ErrorAlert error={error} />
        )
    }

    if(tables) {
        const list = tables.map((table) => {
            return (
                <option className="dropdown-item" key={table.id} value={`${table.id} ${table.capacity}`}>
                    Table: {table.table_name} - Capacity: {table.capacity}
                </option>
            )
        })
        return (
            <div className="btn-group">
                <form onSubmit={handleSubmit}>
                    <select className="form-select form-select-lg mb-3" value={reservationTable} onChange={handleChange} >
                        {list}
                    </select>
                    <button className="btn btn-outline-success" type="submit" onSubmit={handleSubmit}>Submit</button> 
                </form>
                <div>
                    <button type="button" className="btn btn-outline-danger" onClick={cancelHandler}>Cancel</button>
                </div>          
            </div>
        )
    }

    return (
        <div>
            Loading Table Seating...
        </div>
    )
}
