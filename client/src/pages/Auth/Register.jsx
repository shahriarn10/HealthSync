import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { register } from "../../api";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await register(form);
            localStorage.setItem("user", JSON.stringify(data));
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div style={{ margin: "2rem" }}>
            <h2>HealthSync Register</h2>
            <form onSubmit={handleSubmit}>
                <input name="name" placeholder="Name" onChange={handleChange} /><br />
                <input name="email" placeholder="Email" onChange={handleChange} /><br />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />
                <select name="role" onChange={handleChange}>
                    <option value="user">User</option>
                    <option value="doctor">Doctor</option>
                    <option value="pharmacist">Pharmacist</option>
                    <option value="donor">Donor</option>
                </select><br />
                <button type="submit">Register</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
