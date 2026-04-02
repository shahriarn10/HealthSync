import axios from "axios";

export const API = axios.create({
    baseURL: "[localhost](http://localhost:5000/api)" // match your backend port
});

// Auth
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

// Protected endpoints
export const getDoctorData = (token) =>
    API.get("/doctor", { headers: { Authorization: `Bearer ${token}` } });
export const getPharmacyData = (token) =>
    API.get("/pharmacy", { headers: { Authorization: `Bearer ${token}` } });
export const getBloodData = (token) =>
    API.get("/blood", { headers: { Authorization: `Bearer ${token}` } });
