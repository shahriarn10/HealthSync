import mongoose from "mongoose";

const bloodSchema = new mongoose.Schema(
    {
        donorName: String,
        bloodType: String,
        location: String,
        available: { type: Boolean, default: true }
    },
    { timestamps: true }
);

export default mongoose.model("BloodDonation", bloodSchema);
