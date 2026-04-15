import mongoose from "mongoose";

const bloodSchema = new mongoose.Schema(
    {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
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

bloodSchema.index({ isVerified: 1 });
bloodSchema.index({ createdAt: -1 });

export default mongoose.model("BloodDonation", bloodSchema);
