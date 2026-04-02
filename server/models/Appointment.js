import mongoose from "mongoose";

const appointmentSchema = new mongoose.Schema(
    {
        doctorName: String,
        patientName: String,
        date: String,
        time: String,
        status: { type: String, default: "pending" }
    },
    { timestamps: true }
);

export default mongoose.model("Appointment", appointmentSchema);
