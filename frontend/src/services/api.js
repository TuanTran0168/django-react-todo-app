import axios from "axios";

export const SERVER = "http://localhost:8000";

const API = axios.create({
    baseURL: SERVER,
});

export default API;
