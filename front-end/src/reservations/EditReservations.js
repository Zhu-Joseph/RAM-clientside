import React, {useState, useEffect} from 'react'
import { useHistory, useParams } from "react-router-dom";
import { validateReservation } from '../utils/handlers';
import ErrorAlert from '../layout/ErrorAlert';
import { listReservationEdit, updateReservation } from '../utils/api';
import FormReservations from './FormReservations';

export default function EditReservations () {
    const initialError = {
        "message": []
    }

    const [error, setError] = useState({...initialError})
    const [formData, setFormData] = useState([]);
    const {reservation_id} = useParams()
    const history = useHistory()
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(loadReservation, [])

    function loadReservation() {
        const abortController = new AbortController()
        listReservationEdit(reservation_id, ({id: reservation_id}), abortController.signal)
            .then(setFormData)
            .catch(setError)
        return () => abortController.abort();
    }

    function submitHandler(event) {
        event.preventDefault()
        const abortController = new AbortController() 

        const result = validateReservation(formData, error)//NOT ABLE TO PASS THROUGH setError TO CHANGE STATE
        if(!result) return
        setError({message: error.message})
        
        if(error.message.length > 0) {
            console.log("error")
        }

        else {
            updateReservation(reservation_id, {data: formData}, abortController.signal)
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