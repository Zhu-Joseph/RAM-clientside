import React, {useState, useEffect} from "react";
import { Link } from "react-router-dom";
import { listReservations } from "../utils/api";
import {validateSearch} from "../utils/handlers"

export default function Search() {
    const initialState = {
        "mobile_number": ""
      }
    const [formData, setFormData] = useState({ ...initialState });
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    const [phone, setPhone] = useState("")

    useEffect(loadDashboard, [phone]);

    function loadDashboard() {
      const abortController = new AbortController();
      setReservationsError(null);
      listReservations({ mobile_phone: phone.mobile_number }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);

      return () => abortController.abort();
    }

    function handleSubmit(event) {
        event.preventDefault()
        const abortController = new AbortController() 
        const result = validateSearch(formData)
        
        if(result) setPhone(formData)

        return () => abortController.abort()
    }

    const handlePhone = ({ target }) => {
        let value = target.value;
        if (value.length <= 12 && !isNaN(Number(value[value.length - 1]))) {
            if (value.length === 3 || value.length === 7) {
                value += '-'
            }
            setFormData({
            ...formData,
            [target.name]: value,
            });
        }
        else {
            if (value[value.length - 1] === '-' || value.length === 0) {
                value = value.substring(0, value.length - 1)
                setFormData({
                    ...formData,
                    [target.name]: value,
                    });                
            }
        }
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
               Party Size: ${reservation.people}
               Status: ${reservation.status}`}
              {reservation.status === "booked" ? 
              <button>
                <Link to={`/reservations/${reservation_id}/seat`}>Seat</Link>
              </button>: null}    
            </li>
          )
      })

    if(reservations.length === 0) {
      return (
        <div>
          <form onSubmit={handleSubmit}>
                <label>Search </label>
                <input name="mobile_number" type="tel" placeholder="Enter a customer's phone number" 
                onChange={handlePhone} value={formData.mobile_number}/>
                <button onSubmit={handleSubmit}>Find</button>
            </form>
            <h4>No reservations found</h4>
        </div>
      )
    }

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <label>Search </label>
                <input name="mobile_number" type="tel" placeholder="Enter a customer's phone number" 
                onChange={handlePhone} value={formData.mobile_number}/>
                <ol>{list}</ol>
                <button onSubmit={handleSubmit}>Find</button>
            </form>
        </div>
    )
}