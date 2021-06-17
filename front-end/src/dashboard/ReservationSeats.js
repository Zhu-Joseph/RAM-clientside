import React, {useState, useEffect} from 'react'
import {useHistory} from "react-router-dom"

export default function ReservationSeats() {
    const history = useHistory()


    return (
        <div>
            <form>
                <select name="table_id">
                    <option>Here</option>
                    <option>There</option>
                    <option>Everywhere</option>
                </select>
                <button>Submit</button>
                <button>Cancel</button>
            </form>
                
        </div>
    )
}