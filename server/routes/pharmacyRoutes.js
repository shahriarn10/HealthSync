import express from "express";
import { getAllMedicines } from "../controllers/pharmacyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", protect, getAllMedicines);

export default router;
