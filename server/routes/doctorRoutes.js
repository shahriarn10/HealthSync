import express from "express";
import { getAllAppointments } from "../controllers/doctorController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getAllAppointments);

export default router;
