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
            <div>Name: {reservation.first_name} {reservation.last_name}
                    {reservation.status === "booked" ? //TERNARY FOR SEAT AND EDIT BUTTON
                <div>
                    <button>
                        <Link to={`/reservations/${reservation_id}/seat`}>Seat</Link>
                    </button>
                    <button>
                        <Link to={`/reservations/${reservation_id}/edit`}>Edit</Link>
                    </button>
                </div>
                : null}
                <button data-reservation-id-cancel={reservation.reservation_id} onClick={handleCancel}>
                    Cancel
                </button>
            </div>
            
            <div>Reservation Time: {reservation.reservation_time}</div>
            
            <div>Party Size: {reservation.people}</div>
            <div>Phone: {reservation.mobile_number}</div>
            <div>Date: {reservation.reservation_date}</div>
            <div>Status: {reservation.status}</div>




        </li>
    )
}