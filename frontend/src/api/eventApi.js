import axios from "axios";

const BASE_URL = "https://scheduler-app-backend-fdag.onrender.com/api";

export const getEvents = () => axios.get(`${BASE_URL}/events`);
export const createEvent = (data) => axios.post(`${BASE_URL}/events`, data);
