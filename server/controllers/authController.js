import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const genToken = (id) =>
    jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });

export const register = async (req, res) => {
    const { name, email, password, role } = req.body;
    try {
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ message: "Email already exists" });

        const hashed = await bcrypt.hash(password, 10);
        const isApproved = role === "admin" ? false : true;
        const user = await User.create({ name, email, password: hashed, role, isApproved });
        const responseData = {
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
        };
        // Do not return a token if the user is an admin pending approval
        if (isApproved) {
            responseData.token = genToken(user.id);
        }
        res.status(201).json(responseData);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const login = async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: "Invalid credentials" });
        
        if (user.role === "admin" && !user.isApproved) {
            return res.status(403).json({ message: "Admin account pending approval. Please contact a Master Admin." });
        }

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(400).json({ message: "Invalid credentials" });

        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: genToken(user.id)
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
