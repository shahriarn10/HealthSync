import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getDonations, addDonation, deleteDonation, updateDonation } from "../controllers/bloodController.js";

const router = express.Router();

router.get("/", protect, getDonations);
router.post("/", protect, addDonation);
router.put("/:id", protect, updateDonation);
router.delete("/:id", protect, deleteDonation);

export default router;
