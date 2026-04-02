import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { getDonations, addDonation, deleteDonation } from "../controllers/bloodController.js";

const router = express.Router();

router.get("/", protect, getDonations);
router.post("/", protect, addDonation);
router.delete("/:id", protect, deleteDonation);

export default router;
