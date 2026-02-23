import axios from 'axios';

// Cloud backend URL
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "/api",
  withCredentials: true
});

export default API;
