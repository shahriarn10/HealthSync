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
        <div className="max-w-md mx-auto mt-12 animate-in fade-in zoom-in-95 duration-300">
            <div className="glass-card p-8">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold tracking-tight text-slate-800">Create Account</h2>
                    <p className="text-sm text-slate-500 mt-2">Join HealthSync today</p>
                </div>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Full Name</label>
                        <input 
                            name="name" 
                            type="text"
                            placeholder="John Doe" 
                            onChange={handleChange}
                            className="input-field"
                            required
                        />
                    </div>
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
                    <div>
                        <label className="block text-sm font-medium text-slate-700 mb-1">Account Role</label>
                        <select 
                            name="role" 
                            onChange={handleChange}
                            className="input-field cursor-pointer appearance-none bg-white"
                        >
                            <option value="user">Patient / User</option>
                            <option value="doctor">Doctor</option>
                            <option value="pharmacist">Pharmacist</option>
                            <option value="donor">Blood Donor</option>
                            <option value="admin">System Administrator (Admin)</option>
                        </select>
                        {form.role === "admin" && (
                            <p className="text-xs text-rose-500 mt-2 font-medium">⚠️ Admin registrations require approval from an existing Master Admin before login is permitted.</p>
                        )}
                    </div>
                    
                    {error && (
                        <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm font-medium flex items-center gap-2">
                            <span>⚠️ {error}</span>
                        </div>
                    )}
                    
                    <button type="submit" className="w-full btn-primary mt-6 py-3">
                        Create Account
                    </button>
                </form>

                <div className="mt-6 text-center text-sm text-slate-500">
                    Already have an account?{" "}
                    <a href="/login" className="text-sky-600 font-medium hover:underline">
                        Sign in
                    </a>
                </div>
            </div>
        </div>
    );
}
