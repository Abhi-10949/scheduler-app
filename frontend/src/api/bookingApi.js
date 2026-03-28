import axios from "axios";

const BASE_URL = "https://scheduler-app-backend-fdag.onrender.com/api";

export const getBookings = () => axios.get(`${BASE_URL}/bookings`);
export const cancelBooking = (id) =>
    axios.put(`${BASE_URL}/bookings/cancel/${id}`);