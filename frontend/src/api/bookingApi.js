import axios from "axios";
import { API_ROOT } from "../config/api";

export const getBookings = () => axios.get(`${API_ROOT}/bookings`);
export const cancelBooking = (id) =>
    axios.put(`${API_ROOT}/bookings/cancel/${id}`);