import React from 'react'
import {v4} from "uuid"
import "./reservations_styling/FormReservations.css"

export default function FormReservations (props) {

    const {formData, handleChange, handlePhone, 
        handleDate, submitHandler, cancelHandler, 
        handleNumberChange} = props

    return (
        <div className="form">
        <form key={v4} onSubmit={submitHandler}>
            <div className="row mb-3">
                    <label className="col-sm-2 col-form-label">First Name:</label>
                    <input name="first_name" type="text" placeholder="first name" 
                    value={formData.first_name} onChange={handleChange}/>
                </div>
                <div className="row mb-3">
                    <label className="col-sm-2 col-form-label">Last Name:</label>                
                    <input name="last_name" type="text" placeholder="last name"
                    value={formData.last_name} onChange={handleChange}/>
                </div>
                <div className="row mb-3">
                    <label className="col-sm-2 col-form-label">Phone:</label>
                    <input name="mobile_number" type="tel" placeholder="123-456-7890" onChange={handlePhone}
                     value={formData.mobile_number}/>                    
                </div>
                <div className="row mb-3">
                    <label className="col-sm-2 col-form-label">Date:</label>
                    <input name="reservation_date" type="date" placeholder="YYYY-MM-DD" 
                    value={formData.reservation_date} onChange={handleDate}/>
                </div>
                <div className="row mb-3">
                    <label className="col-sm-2 col-form-label">Time:</label>
                    <input name="reservation_time" type="time" placeholder="HH:MM" 
                    value={formData.reservation_time} onChange={handleChange}/>
                </div>
                <div className="row mb-3">
                    <label className="col-sm-2 col-form-label">Party Size:</label>
                    <input name="people" type="number" 
                    value={formData.people} onChange={handleNumberChange}/>
                </div>
                <div className="row mb-3 form-select mb-3">
                    <label className="col-sm-2 col-form-label">Status:</label>
                    <select className="col-sm-2 col-form-label" name="status" value={formData.status} onChange={handleChange}>
                        <option value="booked">Booked</option>
                        <option value="seated">Seated</option>
                        <option value="finished">Finished</option>
                        <option value="cancelled">Cancelled</option>
                    </select>
                </div>      
                <button type="submit" className="btn btn-outline-success" onSubmit={submitHandler}>Submit</button>
            </form>
            <button className="btn btn-outline-danger" onClick={cancelHandler}>Cancel</button>
        </div>
    )
}