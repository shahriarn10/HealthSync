import Medicine from "../models/Medicine.js";
import PharmacyOrder from "../models/PharmacyOrder.js";

// Medicine Functions
export const getMedicines = async (req, res) => {
    try {
        const meds = await Medicine.find().lean();
        res.json(meds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addMedicine = async (req, res) => {
    try {
        // req.body includes name, image, price, quantity
        const med = await Medicine.create(req.body);
        res.status(201).json(med);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteMedicine = async (req, res) => {
    try {
        await Medicine.findByIdAndDelete(req.params.id);
        res.json({ message: "Medicine removed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateMedicine = async (req, res) => {
    try {
        const med = await Medicine.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(med);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Order Functions
export const placeOrder = async (req, res) => {
    try {
        const { items, totalPrice, paymentMethod, senderNumber, transactionId } = req.body;
        
        const newOrder = await PharmacyOrder.create({
            user: req.user._id,
            items,
            totalPrice,
            paymentMethod,
            senderNumber,
            transactionId,
            status: "Pending"
        });

        // Optional: you could deduct quantity from Medicine stock here
        for (let item of items) {
           await Medicine.findByIdAndUpdate(item.medicineId, {
               $inc: { quantity: -item.quantity }
           });
        }

        res.status(201).json(newOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const getOrders = async (req, res) => {
    try {
        // Fetch all orders for pharmacist/admin, populated with user info
        const orders = await PharmacyOrder.find().populate("user", "name email").sort({ createdAt: -1 }).lean();
        res.json(orders);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const updateOrderStatus = async (req, res) => {
    try {
        const { status } = req.body;
        const updatedOrder = await PharmacyOrder.findByIdAndUpdate(
            req.params.id, 
            { status }, 
            { new: true }
        );
        res.json(updatedOrder);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
