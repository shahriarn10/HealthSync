import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        doctorId: { type: mongoose.Schema.Types.ObjectId, ref: "DoctorProfile" },
        doctorName: String,
        patientId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        patientName: String,
        date: String,
        time: String,
        status: { type: String, enum: ["Pending", "Approved", "Rejected"], default: "Pending" }
    },
    { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
