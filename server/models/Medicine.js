import mongoose from "mongoose";

const medicineSchema = new mongoose.Schema(
    {
        name: String,
        type: String,
        quantity: Number,
        price: Number
    },
    { timestamps: true }
);

export default mongoose.model("Medicine", medicineSchema);
