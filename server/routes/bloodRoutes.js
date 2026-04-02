import express from "express";
import { getBloodDonations } from "../controllers/bloodController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getBloodDonations);

export default router;
