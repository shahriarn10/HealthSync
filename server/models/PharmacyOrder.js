import mongoose from "mongoose";

const pharmacyOrderSchema = new mongoose.Schema(
    {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        items: [
            {
                medicineId: { type: mongoose.Schema.Types.ObjectId, ref: "Medicine", required: true },
                name: String,
                price: Number,
                quantity: Number,
                image: String
            }
        ],
        totalPrice: { type: Number, required: true },
        paymentMethod: { type: String, enum: ["bKash", "Nagad"], required: true },
        senderNumber: { type: String, required: true },
        transactionId: { type: String, required: true },
        status: { type: String, enum: ["Pending", "Approved", "Delivered"], default: "Pending" }
    },
    { timestamps: true }
);

export default mongoose.model("PharmacyOrder", pharmacyOrderSchema);
