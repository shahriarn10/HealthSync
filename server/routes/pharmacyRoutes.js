import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { 
    getMedicines, 
    addMedicine, 
    deleteMedicine,
    updateMedicine,
    placeOrder,
    getOrders,
    updateOrderStatus
} from "../controllers/pharmacyController.js";

const router = express.Router();

// Medicine routes
router.get("/", protect, getMedicines);
router.post("/", protect, addMedicine);
router.put("/:id", protect, updateMedicine);
router.delete("/:id", protect, deleteMedicine);

// Order routes
router.post("/order", protect, placeOrder);
router.get("/orders", protect, getOrders);
router.put("/order/:id", protect, updateOrderStatus);

export default router;
