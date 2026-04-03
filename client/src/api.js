import axios from "axios";

export const API = axios.create({
    baseURL: "[localhost](http://localhost:5000/api)"
});

// Auth
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

// Helper
const authHeader = (token) => ({ headers: { Authorization: `Bearer ${token}` } });

// Doctor
export const getDoctorData = (token) => API.get("/doctor", authHeader(token));
export const addDoctorData = (token, data) => API.post("/doctor", data, authHeader(token));
export const deleteAppointment = (token, id) => API.delete(`/doctor/${id}`, authHeader(token));

// Pharmacy
export const getPharmacyData = (token) => API.get("/pharmacy", authHeader(token));
export const addMedicine = (token, data) => API.post("/pharmacy", data, authHeader(token));
export const deleteMedicine = (token, id) => API.delete(`/pharmacy/${id}`, authHeader(token));

// Blood
export const getBloodData = (token) => API.get("/blood", authHeader(token));
export const addDonor = (token, data) => API.post("/blood", data, authHeader(token));
export const deleteDonor = (token, id) => API.delete(`/blood/${id}`, authHeader(token));

// Admin
export const getAdminOverview = (token) => API.get("/admin/overview", authHeader(token));
export const adminDeleteUser = (token, id) => API.delete(`/admin/user/${id}`, authHeader(token));
export const adminDeleteItem = (token, type, id) => API.delete(`/admin/${type}/${id}`, authHeader(token));
