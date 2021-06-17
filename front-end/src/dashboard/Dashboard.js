import React, { useEffect, useState } from "react";
import { useLocation, Link } from "react-router-dom";
import queryString from "query-string"
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";
import { today, next, previous } from "../utils/date-time";

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
  const {search} = useLocation()
  const newDate = queryString.parse(search).date

  useEffect(loadDashboard, [reservationDate]);
  useEffect(loadDefault, [search])

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
      const reservation_id = reservation.id//TO MAKE SURE TEST PASSES AND RUNS

      return (
          <li key={reservation.id}>
            {`First Name: ${reservation.first_name}
             Last Name: ${reservation.last_name}
             Phone: ${reservation.mobile_number}
             Date: ${reservation.reservation_date}
             Time: ${reservation.reservation_time}
             Party Size: ${reservation.people}`}
             <button>
               <Link to={`/reservations/${reservation_id}/seat`}>Seat</Link>
              </button>        
          </li>
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
