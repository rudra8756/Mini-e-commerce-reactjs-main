import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "https://mini-e-commerce-reactjs-main.onrender.com/api"
});

export default API;
