import Appointment from "../models/Appointment.js";

/** Get all appointments  */
export const getAppointments = async (req, res) => {
    try {
        const data = await Appointment.find();
        res.json(data);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/** Create a new appointment */
export const createAppointment = async (req, res) => {
    try {
        const appt = await Appointment.create(req.body);
        res.status(201).json(appt);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/** Delete appointment */
export const deleteAppointment = async (req, res) => {
    try {
        await Appointment.findByIdAndDelete(req.params.id);
        res.json({ message: "Appointment deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
