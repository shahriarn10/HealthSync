import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getMedicines, addMedicine, deleteMedicine } from "../controllers/pharmacyController.js";

const router = express.Router();

router.get("/", protect, getMedicines);
router.post("/", protect, addMedicine);
router.delete("/:id", protect, deleteMedicine);

export default router;
