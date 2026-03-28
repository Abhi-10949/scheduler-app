import axios from "axios";
import { API_ROOT } from "../config/api";

export const getEvents = () => axios.get(`${API_ROOT}/events`);
export const createEvent = (data) => axios.post(`${API_ROOT}/events`, data);
