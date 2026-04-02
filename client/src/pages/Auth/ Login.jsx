import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../../api";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await login(form);
            localStorage.setItem("user", JSON.stringify(data));
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    return (
        <div style={{ margin: "2rem" }}>
            <h2>HealthSync Login</h2>
            <form onSubmit={handleSubmit}>
                <input name="email" placeholder="Email" onChange={handleChange} /><br />
                <input name="password" type="password" placeholder="Password" onChange={handleChange} /><br />
                <button type="submit">Login</button>
            </form>
            {error && <p style={{ color: "red" }}>{error}</p>}
        </div>
    );
}
