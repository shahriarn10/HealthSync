import axios from "axios";

export const API = axios.create({
    baseURL: "http://localhost:5002/api" // match your backend port
});

// Auth
export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);

// Doctor & Appointments
export const getDoctorProfiles = (t) => API.get("/doctor/profiles", { headers: { Authorization: `Bearer ${t}` } });
export const createDoctorProfile = (t, data) => API.post("/doctor/profiles", data, { headers: { Authorization: `Bearer ${t}` } });
export const updateDoctorProfile = (t, id, data) => API.put(`/doctor/profiles/${id}`, data, { headers: { Authorization: `Bearer ${t}` } });
export const deleteDoctorProfile = (t, id) => API.delete(`/doctor/profiles/${id}`, { headers: { Authorization: `Bearer ${t}` } });

export const getAppointments = (t) => API.get("/doctor/appointments", { headers: { Authorization: `Bearer ${t}` } });
export const createAppointment = (t, data) => API.post("/doctor/appointments", data, { headers: { Authorization: `Bearer ${t}` } });
export const updateAppointmentStatus = (t, id, status) => API.put(`/doctor/appointments/${id}/status`, { status }, { headers: { Authorization: `Bearer ${t}` } });
export const deleteAppointment = (t, id) => API.delete(`/doctor/appointments/${id}`, { headers: { Authorization: `Bearer ${t}` } });

export const getPharmacyData = (t) => API.get("/pharmacy", { headers: { Authorization: `Bearer ${t}` } });
export const addMedicine = (t, data) => API.post("/pharmacy", data, { headers: { Authorization: `Bearer ${t}` } });
export const updateMedicine = (t, id, data) => API.put(`/pharmacy/${id}`, data, { headers: { Authorization: `Bearer ${t}` } });
export const deleteMedicine = (t, id) => API.delete(`/pharmacy/${id}`, { headers: { Authorization: `Bearer ${t}` } });
export const createPharmacyOrder = (t, data) => API.post("/pharmacy/order", data, { headers: { Authorization: `Bearer ${t}` } });
export const getPharmacyOrders = (t) => API.get("/pharmacy/orders", { headers: { Authorization: `Bearer ${t}` } });
export const updatePharmacyOrderStatus = (t, id, status) => API.put(`/pharmacy/order/${id}`, { status }, { headers: { Authorization: `Bearer ${t}` } });

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
export const adminApproveAdmin = (t, id) =>
    API.put(`/admin/approve/${id}`, {}, { headers: { Authorization: `Bearer ${t}` } });
export const adminVerifyBloodDonor = (t, id) =>
    API.put(`/admin/blood/verify/${id}`, {}, { headers: { Authorization: `Bearer ${t}` } });
