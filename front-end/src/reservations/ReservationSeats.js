import React, {useState, useEffect} from 'react'
import {useHistory, useParams} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"
import {updateTable, listReservationSeat, listTables} from "../utils/api"
import { v4 } from 'uuid'

export default function ReservationSeats() {
    const [tables, setTables] = useState([])
    const [error, setError] = useState(null);
    const [reservationTable, setReservationTable] = useState("")
    const [reservation, setReservation] = useState([])
    const [updateInfo, setUpdateInfo] = useState({})
    const {reservation_id} = useParams()
    const history = useHistory()

    useEffect(loadTables, [])// eslint-disable-next-line react-hooks/exhaustive-deps
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

    if(reservation.status === "booked") {
        setReservation({ ...reservation, status: "seated", })
    }
    
    function handleSubmit(event) {
        event.preventDefault()

        const abortController = new AbortController()

        if(reservation.people > updateInfo.capacity) {//TO PASS TEST CODE, ORIGINALLY WAS A WINDOW ALERT 
            setError({message: "Party size is greater then table capacity, choose another table."})
            return
        }
        
        else {
            const tableId = updateInfo.id

            updateTable(tableId, reservation, abortController.signal)
                .then(() => {
                    history.push({
                        pathname: "/dashboard",
                        search:`?date=${reservation.reservation_date}`
                    })
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

    if(tables) {
        const list = tables.map((table) => {

            return (
                <option key={v4} className="dropdown-item" name="table_id" value={`${table.id} ${table.capacity}`}>
                    {table.table_name} - {table.capacity}
                </option>
            )
        })
        return (
            <>
                {error ? <ErrorAlert error={error} />: null}
                <div className="btn-group">
                    <form onSubmit={handleSubmit}>
                        <select name="table_id" className="form-select form-select-lg mb-3" value={reservationTable} onChange={handleChange} >
                            {list}
                        </select>
                        <button className="btn btn-outline-success" type="submit" onSubmit={handleSubmit}>Submit</button> 
                    </form>
                    <div>
                        <button type="button" className="btn btn-outline-danger" onClick={cancelHandler}>Cancel</button>
                    </div>          
                </div>
            </>
        )
    }

    return (
        <div>
            Loading Table Seating...
        </div>
    )
}
