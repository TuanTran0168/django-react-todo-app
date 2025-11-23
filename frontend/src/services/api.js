import axios from "axios";

export const SERVER = import.meta.env.VITE_API_URL;

const API = axios.create({
    baseURL: SERVER
});

export default API;
