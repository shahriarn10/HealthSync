import BloodDonation from "../models/BloodDonation.js";

export const getDonations = async (req, res) => {
    try {
        const donors = await BloodDonation.find();
        res.json(donors);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addDonation = async (req, res) => {
    try {
        const donor = await BloodDonation.create(req.body);
        res.status(201).json(donor);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const deleteDonation = async (req, res) => {
    try {
        await BloodDonation.findByIdAndDelete(req.params.id);
        res.json({ message: "Donation entry removed" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
