import React, {useState, useEffect} from 'react'
import {useHistory} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"
import {validateReservation} from "../utils/handlers"
import {createReservations} from "../utils/api"

export default function NewReservations() {
    const initialState = {
        "first_name": "",
        "last_name": "",
        "mobile_number": "",
        "reservation_date": "",
        "reservation_time": "",
        "people": 0
      }
    const initialError = {
        "message": []
    }
    const history = useHistory()
    const [formData, setFormData] = useState({ ...initialState });
    const [error, setError] = useState({...initialError })

    function submitHandler(event) {//TIMEZONE IS 420 OR GMT-7 PDT/PST SO CALI
        event.preventDefault()
        const abortController = new AbortController() 

        const result = validateReservation(formData, error)//NOT ABLE TO PASS THROUGH setError TO CHANGE STATE
        if(!result) return
        setError({message: error.message})
 
        if(error.message.length > 0) {
            console.log('error')
 
        }
        else {
            createReservations({data: formData}, abortController.signal)
            .then(() => {
                history.push("/dashboard")
            })
            .catch(setError)
            
        }

        return () => abortController.abort()
    }

    function cancelHandler() {
        setFormData(initialState)
        history.goBack()
    }

    const handleChange = ({ target }) => {
        const value = target.value;
        setFormData({
          ...formData,
          [target.name]: value,
        });
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

      const handleDate = ({ target }) => {
        let value = target.value;
        if (value.length <= 10) {
            setFormData({
            ...formData,
            [target.name]: value,
            });
        }
      }

      if(error.message.length > 0) {
        return (
            <ErrorAlert error={error} />
        )
    }

    return (
        <div>
            <form onSubmit={submitHandler}>
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
                    value={formData.people} onChange={handleChange}/>
                </div>
                <button type="submit" className="btn btn-outline-success" onSubmit={submitHandler}>Submit</button>                                         
            </form>
            <button className="btn btn-outline-danger" onClick={cancelHandler}>Cancel</button>  
        </div>
    )
}
