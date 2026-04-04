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
        <div className="max-w-md mx-auto mt-12 animate-in fade-in zoom-in-95 duration-300">
            <div className="glass-card p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800">Welcome Back</h2>
                    <p className="text-sm text-slate-500 mt-2">Enter your credentials to access your account</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Email Address</label>
                        <input 
                            name="email" 
                            type="email"
                            placeholder="you@example.com" 
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
                        <input 
                            name="password" 
                            type="password" 
                            placeholder="••••••••" 
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>
                    
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2">
                            <span>⚠️ {error}</span>
                        </div>
                    )}
                    
                    <button type="submit" className="w-full btn-primary mt-4 py-3">
                        Sign In
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Don't have an account?{" "}
                    <a href="/register" className="text-sky-600 font-medium hover:underline">
                        Register here
                    </a>
                </div>
            </div>
        </div>
    );
}
