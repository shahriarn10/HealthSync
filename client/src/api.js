import axios from "axios";

export const API = axios.create({
    baseURL: "http://localhost:5002/api" // match your backend port
});

// Auth
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

// Protected endpoints
export const getDoctorData = (t) => API.get("/doctor", { headers: { Authorization: `Bearer ${t}` } });
export const addDoctorData = (t, data) => API.post("/doctor", data, { headers: { Authorization: `Bearer ${t}` } });
export const deleteAppointment = (t, id) => API.delete(`/doctor/${id}`, { headers: { Authorization: `Bearer ${t}` } });

export const getPharmacyData = (t) => API.get("/pharmacy", { headers: { Authorization: `Bearer ${t}` } });
export const addMedicine = (t, data) => API.post("/pharmacy", data, { headers: { Authorization: `Bearer ${t}` } });
export const deleteMedicine = (t, id) => API.delete(`/pharmacy/${id}`, { headers: { Authorization: `Bearer ${t}` } });

export const getBloodData = (t) => API.get("/blood", { headers: { Authorization: `Bearer ${t}` } });
export const addDonor = (t, data) => API.post("/blood", data, { headers: { Authorization: `Bearer ${t}` } });
export const deleteDonor = (t, id) => API.delete(`/blood/${id}`, { headers: { Authorization: `Bearer ${t}` } });

// Admin
export const getAdminOverview = (t) =>
    API.get("/admin/overview", { headers: { Authorization: `Bearer ${t}` } });
export const adminDeleteUser = (t, id) =>
    API.delete(`/admin/user/${id}`, { headers: { Authorization: `Bearer ${t}` } });
export const adminDeleteItem = (t, type, id) =>
    API.delete(`/admin/${type}/${id}`, { headers: { Authorization: `Bearer ${t}` } });
