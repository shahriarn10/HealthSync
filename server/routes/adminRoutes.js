import express from "express";
import { protect, adminOnly } from "../middleware/authMiddleware.js";
import { getOverview, deleteUser, deleteItem } from "../controllers/adminController.js";

const router = express.Router();
router.get("/overview", protect, adminOnly, getOverview);
router.delete("/user/:id", protect, adminOnly, deleteUser);
router.delete("/:collection/:id", protect, adminOnly, deleteItem); // generic delete by collection

export default router;
