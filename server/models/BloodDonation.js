import mongoose from "mongoose";

const bloodSchema = new mongoose.Schema(
    {
        donorName: { type: String, required: true },
        bloodType: { type: String, required: true },
        location: { type: String, required: true },
        phone: { type: String, required: true },
        lastDonationDate: { type: Date, required: true },
        photo: { type: String, default: "" }, // Store URL or empty for placeholder
        isVerified: { type: Boolean, default: false }, // Admins must verify
        available: { type: Boolean, default: true } // Legacy or manual override
    },
    { timestamps: true }
);

export default mongoose.model("BloodDonation", bloodSchema);
