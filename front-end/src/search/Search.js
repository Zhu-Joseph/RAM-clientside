import React, {useState, useEffect} from "react";
import Reservations from "../reservations/Reservations";
import { listReservations } from "../utils/api";
import {validateSearch} from "../utils/handlers"
import ErrorAlert from "../layout/ErrorAlert";

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
        return (
          <Reservations
            reservation={reservation}
            loadDashboard={loadDashboard}
          />
          )
      })


      
    if(reservations.length === 0) {
      return (
        <div>
          <form onSubmit={handleSubmit} className="row mb-3">
                <label className="col-sm-1 col-form-label">Search </label>
                <div>
                  <input className="col form-control" name="mobile_number" type="tel" placeholder="Enter a customer's phone number" 
                  onChange={handlePhone} value={formData.mobile_number}/>
                </div>
                <button onSubmit={handleSubmit} className="btn btn-secondary">Find</button>
            </form>
            <h4 className="mb-0">No reservations found</h4>
        </div>
      )
    }

    return (
        <div>
            <form onSubmit={handleSubmit} className="row mb-3">
                <label className="col-sm-1 col-form-label">Search </label>
                <div>
                  <input className="col form-control" name="mobile_number" type="tel" placeholder="Enter a customer's phone number" 
                  onChange={handlePhone} value={formData.mobile_number}/>
                </div>
                <button onSubmit={handleSubmit} className="btn btn-secondary">Find</button>
            </form>
            <ol>{list}</ol>
        </div>
    )
}