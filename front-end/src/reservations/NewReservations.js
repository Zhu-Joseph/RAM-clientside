import React, {useState} from 'react'
import {useHistory} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"
import {validateReservation} from "../utils/handlers"
import {createReservations} from "../utils/api"
import FormReservations from './FormReservations'

export default function NewReservations() {
    const initialState = {
        "first_name": "",
        "last_name": "",
        "mobile_number": "",
        "reservation_date": "",
        "reservation_time": "",
        "people": 0,
        "status": "booked"
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
            console.log(`Number of errors ${error.message.length}`)
        }
        else {
            createReservations({data: formData}, abortController.signal)
            .then(() => {
                history.push({
                    pathname: "/dashboard",
                    search:`?date=${formData.reservation_date}`
                })
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

    const handleNumberChange = ({ target }) => {
        const value = target.value;
        setFormData({
          ...formData,
          [target.name]: Number(value),
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

    return (
        <>
        {error.message.length > 0 ? <ErrorAlert error={error} />: null}
            <FormReservations 
            formData={formData}
            handleChange={handleChange}
            handlePhone={handlePhone}
            handleDate={handleDate}
            submitHandler={submitHandler}
            cancelHandler={cancelHandler}
            handleNumberChange={handleNumberChange}
            />
        </>
    )
}
