import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
    getAppointments, 
    createAppointment, 
    deleteAppointment,
    updateAppointmentStatus,
    getDoctors,
    addDoctorProfile,
    deleteDoctorProfile
} from "../controllers/doctorController.js";

const router = express.Router();

// Doctor Profiles endpoints
router.get("/profiles", protect, getDoctors);
router.post("/profiles", protect, addDoctorProfile);
router.delete("/profiles/:id", protect, deleteDoctorProfile);

// Appointment endpoints
router.get("/appointments", protect, getAppointments);
router.post("/appointments", protect, createAppointment);
router.put("/appointments/:id/status", protect, updateAppointmentStatus);
router.delete("/appointments/:id", protect, deleteAppointment);

export default router;
