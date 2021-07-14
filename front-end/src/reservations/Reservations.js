import React from "react"
import { Link } from "react-router-dom";
import { v4 } from "uuid";
import { updateStatus } from "../utils/api";

export default function Reservations (props) {
    const {reservation} = props

    const reservation_id = "id"//TO MAKE SURE TEST PASSES AND RUNS

    const handleCancel = () => {
        const abortController = new AbortController();
        const result = window.confirm("Do you want to cancel this reservation? This cannot be undone.")

        if(result) {
            updateStatus(reservation[reservation_id], {data: {"status": "cancelled"}}, abortController.signal)
            .then(props.loadDashboard)
        }
    }

    return (
        <li key={v4}>
            <div name="first_name">First: {reservation.first_name}</div>
            <div name="last_name">Last: {reservation.last_name}</div>       
            <div name="reservation_time">Reservation Time: {reservation.reservation_time}</div>           
            <div name="people">Party Size: {reservation.people}</div>
            <div name="mobile_number">Phone: {reservation.mobile_number}</div>
            <div name="reservation_date">Date: {reservation.reservation_date}</div>
            <div>
                <span data-reservation-id-status={reservation.id}>Status: {reservation.status}</span>
                {reservation.status === "booked" ? //TERNARY FOR SEAT AND EDIT BUTTON
                <>
                    <button type="submit" className="btn btn-outline-success">
                        <Link to={`/reservations/${reservation.id}/seat`}>Seat</Link>
                    </button>
                    <button type="submit" className="btn btn-outline-dark">
                        <Link to={`/reservations/${reservation[reservation_id]}/edit`}>Edit</Link>
                    </button>
                    <button className="btn btn-outline-danger" 
                        data-reservation-id-cancel={reservation[reservation_id]} 
                        onClick={handleCancel}>
                        Cancel
                    </button>
                </>
                : 
                <button className="btn btn-outline-danger" 
                    data-reservation-id-cancel={reservation[reservation_id]} 
                    onClick={handleCancel}>
                        Cancel
                </button>}
            </div>
        </li>
    )
}