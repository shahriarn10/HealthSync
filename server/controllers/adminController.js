import User from "../models/User.js";
import Appointment from "../models/Appointment.js";
import Medicine from "../models/Medicine.js";
import BloodDonation from "../models/BloodDonation.js";

/** Overview: summary stats + all data */
export const getOverview = async (_req, res) => {
    try {
        const users = await User.find({}, "-password").lean();
        const appointments = await Appointment.find().lean();
        const medicines = await Medicine.find().lean();
        const donors = await BloodDonation.find().lean();

        res.json({
            stats: {
                totalUsers: users.length,
                appointments: appointments.length,
                medicines: medicines.length,
                donors: donors.length
            },
            users,
            appointments,
            medicines,
            donors
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/** Delete user */
export const deleteUser = async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: "User deleted" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/** Generic deletion (by collection param) */
export const deleteItem = async (req, res) => {
    const { collection, id } = req.params;
    const models = { appointment: Appointment, medicine: Medicine, blood: BloodDonation };
    const model = models[collection];
    if (!model) return res.status(400).json({ message: "Invalid collection" });
    try {
        await model.findByIdAndDelete(id);
        res.json({ message: `${collection} item deleted` });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/** Verify/Approve a blood donor */
export const verifyBloodDonor = async (req, res) => {
    try {
        const donor = await BloodDonation.findByIdAndUpdate(
            req.params.id,
            { isVerified: true },
            { new: true }
        );
        res.json({ message: "Blood donor verified", donor });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

/** Approve admin registration */
export const approveAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user || user.role !== "admin") return res.status(400).json({ message: "Invalid admin request." });
        
        user.isApproved = true;
        await user.save();
        res.json({ message: "Admin approved successfully", user });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
