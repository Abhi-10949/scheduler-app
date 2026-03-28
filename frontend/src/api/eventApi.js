import axios from "axios";

const BASE_URL = "http://localhost:8000/api";

export const getEvents = () => axios.get(`${BASE_URL}/events`);
export const createEvent = (data) => axios.post(`${BASE_URL}/events`, data);