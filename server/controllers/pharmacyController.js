import Medicine from "../models/Medicine.js";

export const getMedicines = async (req, res) => {
    try {
        const meds = await Medicine.find();
        res.json(meds);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const addMedicine = async (req, res) => {
    try {
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
