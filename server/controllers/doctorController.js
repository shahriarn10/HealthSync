import Appointment from "../models/Appointment.js";
import DoctorProfile from "../models/DoctorProfile.js";

// -------- Doctor Profile Management --------
export const getDoctors = async (req, res) => {
    try {
        const doctors = await DoctorProfile.find();
        res.json(doctors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addDoctorProfile = async (req, res) => {
    try {
        // Only Admin or Doctor roles can reach here based on routes middleware, or UI hiding
        const doc = await DoctorProfile.create(req.body);
        res.status(201).json(doc);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteDoctorProfile = async (req, res) => {
    try {
        await DoctorProfile.findByIdAndDelete(req.params.id);
        res.json({ message: "Doctor profile deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// -------- Appointment Management --------
export const getAppointments = async (req, res) => {
    try {
        // If the user is a patient, return their appointments. If doc/admin, return all.
        let filter = {};
        if (req.user.role === "user" || req.user.role === "donor" || req.user.role === "pharmacist") {
            filter.patientId = req.user._id;
        }
        
        const data = await Appointment.find(filter).sort({ createdAt: -1 });
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const createAppointment = async (req, res) => {
    try {
        // Inherit patient ID from the authenticated request
        const newAppt = { ...req.body, patientId: req.user._id, status: "Pending" };
        const appt = await Appointment.create(newAppt);
        res.status(201).json(appt);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateAppointmentStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedAppt = await Appointment.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        res.json(updatedAppt);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: "Appointment deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
