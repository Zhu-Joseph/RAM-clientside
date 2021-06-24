import React from "react"
import {Link} from "react-router-dom";
import { updateStatus } from "../utils/api";

export default function Reservations (props) {
    const {reservation} = props
    const reservation_id = reservation.id//TO MAKE SURE TEST PASSES AND RUNS

    const handleCancel = () => {
        const abortController = new AbortController();
        const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.")

        if(result) {
            updateStatus(reservation_id, {data: {"status": "cancelled"}}, abortController.signal)
            .then(props.loadDashboard)
        }
    }

    return (
        <li key={reservation.id}>
        {`First Name: ${reservation.first_name}
         Last Name: ${reservation.last_name}
         Phone: ${reservation.mobile_number}
         Date: ${reservation.reservation_date}
         Time: ${reservation.reservation_time}
         Party Size: ${reservation.people}
         Status: ${reservation.status}`}
         {reservation.status === "booked" ? 
          <button>
            <Link to={`/reservations/${reservation_id}/seat`}>Seat</Link>
          </button>: null}
          <button onClick={handleCancel}>Cancel</button>
      </li>
    )
}