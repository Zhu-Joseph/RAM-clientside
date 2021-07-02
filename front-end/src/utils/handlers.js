import {formatAsTime, today} from "../utils/date-time"

export function validateTable (formData, error) {//TO VALIDATE THE DATA INPUT FROM THE FORM
    // let incomplete = []

    if(formData.table_name.length < 2) {
        error.message.push(`Please have at least two characters for you table name`)
    }

    if(formData.capacity < 1) {
        error.message.push(`Minimum party size of 1`)
    }

    if(error.message.length === 1) {
        // window.alert(`${incomplete[0]}`)
        return false
    } 
    
    else if (error.message.length === 2) {
        const array = error.message.join(", ").toLowerCase()
        const errorMessage = array.charAt(0).toUpperCase() + array.slice(1)
        error.message = errorMessage
        return false
    }
    return true 
}

function dayofweek(y, m, d)//TO CHECK FOR TUESDAY = 2, [0-6] = SUN-SAT
{// HELPER FUNCTION FOR VALIDATE RESERVATION
    let t = [ 0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4 ];
    y -= (m < 3) ? 1 : 0;
    return ( y + y/4 - y/100 + y/400 + t[m-1] + d) % 7;
}

export function validateReservation (formData, error) {
    const resvDate = formData.reservation_date
    const resvTime = formData.reservation_time
    const now = new Date()
    const currentTime = `${('00' + now.getHours()).slice(-2)}:${('00' + now.getMinutes()).slice(-2)}:${now.getSeconds()}`
    const nowTime = formatAsTime(currentTime)
    const date = resvDate.split("-")
    const checkTuesday = Math.round(dayofweek(
        Number(date[0]), Number(date[1]), Number(date[2])
        ))

    if(formData.first_name === "" ||// CHECK TO MAKE SURE ALL THE FIELDS ARE COMPLETE
        formData.last_name  === ""||
        formData.mobile_number === "" || 
        formData.reservation_date === "" ||
        formData.reservation_time === "" ||
        formData.people < 1) {
            window.alert("Please complete all parts of the reservation")
            return false
        }
        
    if(resvDate < today()) {
        error.message.push("Cannot make reservations for past dates")
    }

    if(checkTuesday === 2) {
        error.message.push("Please choose another date as we are closed on Tuesdays")
    }

    if(resvTime < "10:30") {
        error.message.push("Cannot make reservations before operating hours")
    }

    else if( resvTime > "21:30") {
        error.message.push("Cannot make reservations after operating hours")
    }

    else if(resvDate === today() && resvTime < nowTime) {
        error.message.push("Cannot make resvervations for past times")
    }
    
    if(error.message.length > 1) {
        const array = error.message.join(", ").toLowerCase()
        const errorMessage = array.charAt(0).toUpperCase() + array.slice(1)
        error.message = errorMessage
    }
    return true
}

export function validateSearch(formData) {
    if(formData.mobile_number.length < 12) {
        window.alert("Please enter a complete phone number")
        return false
    }
    return true
}

