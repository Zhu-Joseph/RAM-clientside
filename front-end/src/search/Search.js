import React, {useState, useEffect} from "react";
import { Link, useLocation, useHistory } from "react-router-dom";
import Reservations from "../reservations/Reservations";
import { listReservations } from "../utils/api";
import ErrorAlert from "../layout/ErrorAlert";

export default function Search() {
    const initialState = {
        "mobile_number": ""
      }
    const [formData, setFormData] = useState({ ...initialState });
    const [reservations, setReservations] = useState([]);
    const [reservationsError, setReservationsError] = useState(null);
    const {search} = useLocation()
    const history = useHistory()
    const searchPhone = search.replace(/([a-z]|\?|=|_)/g, "")

    useEffect(loadDashboard, [searchPhone]);

    function loadDashboard() {
      const abortController = new AbortController();
      setReservationsError(null);
      listReservations({ mobile_phone: searchPhone ? searchPhone : undefined }, abortController.signal)
        .then(setReservations)
        .catch(setReservationsError);

      return () => abortController.abort();
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

    function handleSubmit(event) {
      event.preventDefault()
      // if(formData.mobile_phone.length != 12) {
      //   window.alert("Please enter valid phone number")
      // } else {
        history.push(`/search?mobile_phone=${formData.mobile_number}`)
      // }
    }

    const list = reservations.map((reservation) => {
      return (
        <Reservations
          reservation={reservation}
          loadDashboard={loadDashboard}
        />
        )
    })

    if(reservationsError) {
      <ErrorAlert error={reservationsError} />
    }

    if(reservations.length === 0) {
      return (
        <div>
          <form className="row mb-3">
                <label className="col-sm-1 col-form-label">Search</label>
                <div>
                  <input className="col form-control" name="mobile_number" type="tel" placeholder="Enter phone number" 
                  onChange={handlePhone} value={formData.mobile_number}/>
                </div>
                <button type="submit" className="btn btn-outline-secondary">
                  <Link to={`/search?mobile_phone=${formData.mobile_number}`}>Find</Link>
                </button>
            </form>
            <h4 className="mb-0">No reservations found</h4>
        </div>
      )
    }

    return (
        <div>
            <form className="row mb-3" onSubmit={handleSubmit}>
                <label className="col-sm-1 col-form-label">Search</label>
                <div>
                  <input className="col form-control" name="mobile_number" type="tel" placeholder="Enter a customer's phone number" 
                  onChange={handlePhone} value={formData.mobile_number}/>
                </div>
                <button type="submit" className="btn btn-outline-secondary">
                  Find
                </button>
            </form>
            <ol>{list}</ol>
        </div>
    )
}