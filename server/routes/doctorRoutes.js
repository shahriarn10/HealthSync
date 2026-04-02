import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getAppointments, createAppointment, deleteAppointment } from "../controllers/doctorController.js";

const router = express.Router();

router.get("/", protect, getAppointments);
router.post("/", protect, createAppointment);
router.delete("/:id", protect, deleteAppointment);

export default router;
