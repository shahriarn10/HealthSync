import mongoose from "mongoose";

const doctorProfileSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        specialization: { type: String, required: true },
        image: { type: String }, // Base64 string for image
        availableTimes: [{ type: String }] // Array of formatted strings like "10:00 AM"
    },
    { timestamps: true }
);

export default mongoose.model("DoctorProfile", doctorProfileSchema);
