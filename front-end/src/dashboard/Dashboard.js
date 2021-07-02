import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import queryString from "query-string"
import { listReservations, listTables} from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";

import Reservations from "../reservations/Reservations";
import Tables from "../tables/Tables";

/**
 * Defines the dashboard page.
 * @param date
 *  the date for which the user wants to view reservations.
 * @returns {JSX.Element}
 */
function Dashboard({ date }) {//PROP IS TODAY, SO BY DEFAUL ITS TODAY
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservationDate, setReservationDate] = useState(date)
  const [tables, setTables] = useState([])
  const {search} = useLocation()
  const newDate = queryString.parse(search).date

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadDashboard, [search, reservationDate]);  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(loadDefault, [search])  
  useEffect(loadTables, [])
 
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    if(newDate) {
      listReservations({ date: newDate }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);
    }
    else {      
      listReservations({ date: reservationDate }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);
    }
    return () => abortController.abort();
  }

  function loadDefault() {
    if(search) return
    const abortController = new AbortController();
    setReservationDate(date)
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController()
    setReservationsError(null)
    listTables()
        .then((tables) => setTables(tables.data))
        .catch(setReservationsError)
    return () => abortController.abort()
  }

  const handlePrev = () => {
     newDate ? setReservationDate(previous(newDate)) : setReservationDate(previous(date))
  }

  const handleNext = () => {  
    newDate ? setReservationDate(next(newDate)) : setReservationDate(next(date))
  }

  const handleToday = () => {
    setReservationDate(today())
  }

  const list = reservations.map((reservation) => {
    return (//PASSING IN PROPS TO MAKE CODE CLEANER
      <Reservations 
        reservation={reservation}
        loadDashboard={loadDashboard}
        newDate={newDate}
      /> 
      )
  })
   
  const listTable = tables.map((table) => {
    return (//PASSING IN PROPS TO MAKE CODE CLEANER
      <Tables 
        table={table}
        loadTables={loadTables}
        loadDashboard={loadDashboard}
        setReservationsError={setReservationsError}
      />
    )
  })

  if(newDate !== reservationDate && search !== "") {
    setReservationDate(newDate)
    loadDashboard()
  }

  return (
    <main>
      <h1>Dashboard</h1>
      <div className="d-md-flex mb-3">
        <h4 className="mb-0" value={reservationDate}>{`Reservations for ${reservationDate}`}</h4>
      </div>
      <ErrorAlert error={reservationsError} />

      {/* LIST OF RESERVATIONS */}
      <ol className="list-unstyled">{list}</ol>

      {/* PREVIOUS TODAY NEXT BUTTONS BELOW RESERVATION LIST */}
      <div className="btn-group" role="group" aria-label="Basic outlined example">
        <button onClick={handlePrev} type="button" className="btn btn-outline-warning">
          <Link to={`dashboard?date=${previous(reservationDate)}`}>Previous</Link>
        </button>
        <button onClick={handleToday} type="button" className="btn btn-outline-warning">
          <Link to={`dashboard?date=${today()}`}>Today</Link>
        </button>
        <button onClick={handleNext} type="button" className="btn btn-outline-warning">
          <Link to={`dashboard?date=${next(reservationDate)}`}>Next</Link>
        </button>
      </div>
      

    {/* LIST OF TABLES */}
      <div>
        <br/>
        <h4 className="mb-0">Tables</h4>
        <ol className="list-group">
          {listTable}
        </ol>
      </div>
    </main>
  )
}

export default Dashboard;
