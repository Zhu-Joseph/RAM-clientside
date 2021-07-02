/**
 * Defines the base URL for the API.
 * The default values is overridden by the `API_BASE_URL` environment variable.
 */
import formatReservationDate from "./format-reservation-date";
import formatReservationTime from "./format-reservation-date";

const API_BASE_URL =
  process.env.REACT_APP_API_BASE_URL || "http://localhost:5000";

/**
 * Defines the default headers for these functions to work with `json-server`
 */
const headers = new Headers();
headers.append("Content-Type", "application/json");

/**
 * Fetch `json` from the specified URL and handle error status codes and ignore `AbortError`s
 *
 * This function is NOT exported because it is not needed outside of this file.
 *
 * @param url
 *  the url for the requst.
 * @param options
 *  any options for fetch
 * @param onCancel
 *  value to return if fetch call is aborted. Default value is undefined.
 * @returns {Promise<Error|any>}
 *  a promise that resolves to the `json` data or an error.
 *  If the response is not in the 200 - 399 range the promise is rejected.
 */
async function fetchJson(url, options, onCancel) {
  try {
    const response = await fetch(url, options);

    if (response.status === 204) {
      return null;
    }

    const payload = await response.json();
    
    if (payload.error) {
      return Promise.reject({ message: payload.error });
    }
    return payload.data;
  } catch (error) {
    if (error.name !== "AbortError") {
      console.error(error.stack);
      throw error;
    }
    return Promise.resolve(onCancel);
  }
}

/**
 * Retrieves all existing reservation.
 * @returns {Promise<[reservation]>}
 *  a promise that resolves to a possibly empty array of reservation saved in the database.
 */

export async function listReservations(params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

//TO GET TABLES
export async function listTables() {
  const url = `${API_BASE_URL}/tables`
  const getTables = await fetch(url)
  const data = await getTables.json()
  return data 
}

// TO CREATE A NEW RESERVATION
export async function createReservations(reservation, signal) {
  const url = `${API_BASE_URL}/reservations`
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(reservation),
    signal,
  }
  return await fetchJson(url, options, [])
}

// TO CREATE A NEW RESERVATION
export async function createTable(table, signal) {
  const url = `${API_BASE_URL}/tables/new`
  const options = {
    method: "POST",
    headers,
    body: JSON.stringify(table),
    signal,
  }
  return await fetchJson(url, options, [])
}

//TO UPDATE TABLES OR SET SEATS
export async function updateTable(tableId, reservation, signal) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify({data: reservation}),
    signal,
  }
  return await fetchJson(url, options, [])
}

//TO DELETE TABLE
export async function deleteTable(tableId, signal) {
  const url = `${API_BASE_URL}/tables/${tableId}/seat`
  const options = {
    method: "DELETE",
    headers,
    body: JSON.stringify({data: tableId}),
    signal,
  }
  return await fetchJson(url, options, [])
}

//TO UPDATE RESERVATION STATUS
export async function updateStatus(reservationId, newStatus, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}/status`
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(newStatus),
    signal,
  }
  return await fetchJson(url, options, [])
}

//TO FULLY UPDATE RESERVATION
export async function updateReservation(reservationId, updateInfo, signal) {
  const url = `${API_BASE_URL}/reservations/${reservationId}/edit`
  const options = {
    method: "PUT",
    headers,
    body: JSON.stringify(updateInfo),
    signal,
  }
  return await fetchJson(url, options, [])
}

//TO GET RESERVATION FOR SEATING
export async function listReservationSeat(reservationId, params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservationId}/seat`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

//TO GET RESERVATION FOR EDITING
export async function listReservationEdit(reservationId, params, signal) {
  const url = new URL(`${API_BASE_URL}/reservations/${reservationId}/edit`);
  Object.entries(params).forEach(([key, value]) =>
    url.searchParams.append(key, value.toString())
  );
  return await fetchJson(url, { headers, signal }, [])
    .then(formatReservationDate)
    .then(formatReservationTime);
}

