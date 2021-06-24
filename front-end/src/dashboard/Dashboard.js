import React, { useEffect, useState } from "react";
import { useLocation, Link, useHistory } from "react-router-dom";
import queryString from "query-string"
import { listReservations, deleteTable, updateStatus} from "../utils/api";
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
  const [reservations, setReservations] = useState([]);
  const [reservationsError, setReservationsError] = useState(null);
  const [reservationDate, setReservationDate] = useState(date)
  const history = useHistory()
  const [tables, setTables] = useState([])
  const {search} = useLocation()
  const newDate = queryString.parse(search).date

  useEffect(loadDashboard, [reservationDate]);
  useEffect(loadDefault, [search])
  useEffect(loadTables, [])
 
  function loadDashboard() {
    const abortController = new AbortController();
    setReservationsError(null);
    listReservations({ date: reservationDate }, abortController.signal)
      .then(setReservations)
      .catch(setReservationsError);
    return () => abortController.abort();
  }
  
  function loadDefault() {
    if(search) return
    const abortController = new AbortController();
    setReservationDate(date)
    return () => abortController.abort();
  }

  function loadTables() {
    const abortController = new AbortController();
    setReservationsError(null)
    fetch("http://localhost:5000/tables")
    .then((response => response.json()))
    .then((tables => setTables(tables.data)))
    .catch(setReservationsError)
    return () => abortController.abort();
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
      return (
        <Reservations 
          reservation={reservation}
          loadDashboard={loadDashboard}
        /> 
        )
    })
   
    const listTable = tables.map((table) => {

      return (
        <Tables 
          table={table}
          loadTables={loadTables}
          loadDashboard={loadDashboard}
          setReservationsError={setReservationsError}
        />
      )
    })

    // if(newDate) {
      return (
        <main>
          <h1>Dashboard</h1>
          <div className="d-md-flex mb-3">
            <h4 className="mb-0" value={reservationDate}>{`Reservations for ${reservationDate}`}</h4>
          </div>
          <ErrorAlert error={reservationsError} />
          <ol>{list}</ol>
            <button onClick={handlePrev}>
              <Link to={`dashboard?date=${previous(reservationDate)}`}>Previous</Link>
            </button>
            <br/>
            <button onClick={handleToday}>
              <Link to={`dashboard?date=${today()}`}>Today</Link>
            </button>
            <br/>
            <button onClick={handleNext}>
              <Link to={`dashboard?date=${next(reservationDate)}`}>Next</Link>
            </button>
            <ol>
              {listTable}
            </ol>
        </main>
      );
    // }


  // return (
  //   <main>
  //     <h1>Dashboard</h1>
  //     <div className="d-md-flex mb-3">
  //       <h4 className="mb-0" value={reservationDate}>{`Reservations for ${date}`}</h4>
  //     </div>
  //     <ErrorAlert error={reservationsError} />
  //     <ol>{list}</ol>
  //       <button onClick={handlePrev}>
  //         <Link to={`dashboard?date=${previous(date)}`}>Second Previous</Link>
  //       </button>
  //       <br/>
  //       <button onClick={handleToday}>
  //         <Link to={`dashboard?date=${today()}`}>Second Today</Link>
  //       </button>
  //       <br/>
  //       <button onClick={handleNext}>
  //         <Link to={`dashboard?date=${next(date)}`}>Second Next</Link>
  //       </button>
  //   </main>
  // );
}

export default Dashboard;
