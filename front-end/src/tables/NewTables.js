import React, {useState} from 'react'
import {useHistory} from "react-router-dom"
import ErrorAlert from "../layout/ErrorAlert"
import {validateTable} from "../utils/handlers"
import {createTable} from "../utils/api"

export default function NewTables() {
    const initialState = {
        "table_name": "",
        "capacity": 0,
        "occupied":false,
    }

    const initialError = {
        "message": []
    }
    const history = useHistory()
    const [formData, setFormData] = useState({...initialState})
    const [error, setError] = useState({...initialError})

    function submitHandler(event) {
        event.preventDefault()
        const abortController = new AbortController()
        const result = validateTable(formData, error)
 
        if(!result) setError({message: error.message})
        

        if(error.message.length > 0) {
            console.log(`Error ${error.message}`)
        }

        if(result) {
            createTable({data: formData}, abortController.signal)
            .then(() => {
                history.push("/dashboard")
            })
            .catch(setError)
        }
        return () => abortController.abort()
    }
    
    const handleChange = ({ target }) => {
        const value = target.value;
        setFormData({
          ...formData,
          [target.name]: value,
        })
    }

    const handleCapacity = ({ target }) => {
        let value = target.value
        if(value > 0 && !isNaN(Number(value[value.length - 1]))) {

            setFormData({
            ...formData,
            [target.name]: Number(value),
            })
        } else {
            if(value.length === 0) {
                setFormData({
                    ...formData,
                    [target.name]: value,
                })
            }
        }
    }

    function cancelHandler() {
        history.goBack()
        setFormData(initialState)
    }

    return (
        <div >
            {error.message.length > 0 ? <ErrorAlert error={error} />: null}
            <form onSubmit={submitHandler} >
                <div className="row mb-3">
                    <label className="col-sm-2 col-form-label">Table Name:</label>
                    <div>
                        <input name="table_name" type="text" className="col form-control"
                        onChange={handleChange} value={formData.table_name}/>
                    </div>
                </div>
                <div className="row mb-3">
                    <label className="col-sm-2 ">Capacity:</label>
                    <div>
                        <input name="capacity" type="number" className="col form-control"
                        onChange={handleCapacity} value={formData.capacity} />
                    </div>                  
                </div>
                <button className="btn btn-outline-success" type="submit" onSubmit={submitHandler}>Submit</button>
            </form>
            <div>
                <button type="button" className="btn btn-outline-danger" onClick={cancelHandler}>Cancel</button>
            </div>
        </div>
    )
}
