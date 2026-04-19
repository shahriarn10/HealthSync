import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../../api";
import { motion } from "framer-motion";
import { AlertCircle, Eye, EyeOff } from "lucide-react";

export default function Register() {
    const [form, setForm] = useState({ name: "", email: "", password: "", role: "user" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const { data } = await register(form);
            if (form.role === "admin") {
                alert("Admin account created successfully! Please wait for a Master Admin to approve your account before logging in.");
                navigate("/login");
                return;
            }
            localStorage.setItem("user", JSON.stringify(data));
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    const fadeInUp = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } }
    };

    const staggerContainer = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.1
            }
        }
    };

    return (
        <div className="h-[calc(100vh-4rem)] bg-slate-50 flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans overflow-hidden animate-in fade-in duration-500">
            {/* Main App Container - Boxed Layout for perfect display ratio */}
            <div className="w-full max-w-[1400px] h-full max-h-[800px] min-h-[500px] bg-slate-900 rounded-[2rem] lg:rounded-[2.5rem] overflow-hidden relative flex shadow-2xl flex-col lg:flex-row shadow-slate-900/20">
                
                {/* Background Layer inside container */}
                <div className="absolute inset-0 z-0">
                    <img 
                        src="https://images.unsplash.com/photo-1516549655169-df83a0774514?auto=format&fit=crop&w=1920&q=80" 
                        alt="Background" 
                        className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-[#0f172a]/85 mix-blend-multiply" />
                    <div className="absolute inset-0 bg-gradient-to-r from-[#0f172a]/95 via-[#0f172a]/60 to-[#0f172a]/40" />
                </div>

                {/* Left Side - Branding & Text */}
                <div className="relative z-10 w-full lg:w-[55%] xl:w-[60%] p-8 sm:p-12 lg:p-16 flex flex-col justify-between hidden sm:flex">
                    <motion.div 
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Link to="/" className="flex items-center gap-3 text-2xl font-bold tracking-tight text-white hover:opacity-80 transition-opacity w-fit">
                            <div className="size-9 rounded-xl bg-white flex items-center justify-center shadow-lg">
                                <span className="text-slate-900 text-xl leading-none font-black">+</span>
                            </div>
                            HealthSync
                        </Link>
                    </motion.div>

                    <div className="max-w-2xl mt-auto pb-8 lg:pb-12">
                        <motion.h1 
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.2 }}
                            className="text-4xl sm:text-5xl lg:text-[56px] font-bold text-white leading-[1.15] mb-6 tracking-tight"
                        >
                            Heal Smarter. Connect Faster.<br/>Manage Anywhere.
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.7, delay: 0.4 }}
                            className="text-lg text-slate-300 leading-relaxed max-w-xl font-medium"
                        >
                            From quick consultations to full medical records, our powerful platform lets you seamlessly control your health journey across all devices.
                        </motion.p>
                        
                        <motion.div 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.7, delay: 0.6 }}
                            className="flex gap-2.5 mt-10 items-center"
                        >
                            <div className="w-8 h-1.5 bg-white rounded-full shadow-[0_0_10px_rgba(255,255,255,0.3)]"></div>
                            <div className="w-1.5 h-1.5 bg-white/30 rounded-full hover:bg-white/50 cursor-pointer transition-colors"></div>
                            <div className="w-1.5 h-1.5 bg-white/30 rounded-full hover:bg-white/50 cursor-pointer transition-colors"></div>
                        </motion.div>
                    </div>
                </div>

                {/* Right Side - Form Card */}
                <div className="relative z-20 w-full lg:w-[45%] xl:w-[40%] flex items-center justify-center p-4 lg:p-10 h-full">
                    <motion.div 
                        initial={{ opacity: 0, scale: 0.95, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.6, type: "spring", stiffness: 200, damping: 20 }}
                        className="w-full max-w-[440px] bg-white rounded-[2rem] p-8 sm:p-10 shadow-2xl flex flex-col mx-auto max-h-full overflow-y-auto custom-scrollbar"
                    >
                        <motion.div variants={staggerContainer} initial="hidden" animate="visible" className="flex-1 flex flex-col justify-center">
                            <motion.div variants={fadeInUp} className="mb-8">
                                <h2 className="text-[28px] font-bold text-slate-900 mb-2 tracking-tight">Create Account</h2>
                                <p className="text-[15px] text-slate-500 font-medium">Join HealthSync to get started.</p>
                            </motion.div>
                            
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <motion.div variants={fadeInUp}>
                                    <label className="block text-[11px] font-bold text-slate-900/80 mb-2 uppercase tracking-wide">Full Name</label>
                                    <input 
                                        name="name" 
                                        type="text"
                                        placeholder="Your Name" 
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-[15px] bg-white placeholder:text-slate-400 font-medium"
                                        required
                                        disabled={isLoading}
                                    />
                                </motion.div>

                                <motion.div variants={fadeInUp}>
                                    <label className="block text-[11px] font-bold text-slate-900/80 mb-2 uppercase tracking-wide">Email</label>
                                    <input 
                                        name="email" 
                                        type="email"
                                        placeholder="you@example.com" 
                                        onChange={handleChange}
                                        className="w-full px-4 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-[15px] bg-white placeholder:text-slate-400 font-medium"
                                        required
                                        disabled={isLoading}
                                    />
                                </motion.div>
                                
                                <motion.div variants={fadeInUp}>
                                    <label className="block text-[11px] font-bold text-slate-900/80 mb-2 uppercase tracking-wide">Password</label>
                                    <div className="relative">
                                        <input 
                                            name="password" 
                                            type={showPassword ? "text" : "password"}
                                            placeholder="Input your password" 
                                            onChange={handleChange}
                                            className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-[15px] bg-white placeholder:text-slate-400 font-medium"
                                            required
                                            disabled={isLoading}
                                        />
                                        <button 
                                            type="button" 
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                                        >
                                            {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                                        </button>
                                    </div>
                                </motion.div>

                                <motion.div variants={fadeInUp}>
                                    <label className="block text-[11px] font-bold text-slate-900/80 mb-2 uppercase tracking-wide">Account Role</label>
                                    <div className="relative">
                                        <select 
                                            name="role" 
                                            onChange={handleChange}
                                            className="w-full pl-4 pr-12 py-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-1 focus:ring-slate-900 focus:border-slate-900 transition-all text-[15px] bg-white font-medium appearance-none cursor-pointer text-slate-800"
                                            disabled={isLoading}
                                        >
                                            <option value="user">Patient / User</option>
                                            <option value="doctor">Doctor</option>
                                            <option value="donor">Blood Donor</option>
                                            <option value="admin">System Administrator</option>
                                        </select>
                                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none text-slate-400">
                                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                                        </div>
                                    </div>
                                    {form.role === "admin" && (
                                        <motion.p 
                                            initial={{ opacity: 0, height: 0 }}
                                            animate={{ opacity: 1, height: "auto" }}
                                            className="text-[13px] text-amber-600 mt-2 font-medium bg-amber-50 p-2 rounded-lg border border-amber-100"
                                        >
                                            ⚠️ Admin accounts need approval before login.
                                        </motion.p>
                                    )}
                                </motion.div>
                                
                                {error && (
                                    <motion.div 
                                        initial={{ opacity: 0, scale: 0.95 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        className="p-3.5 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm font-medium flex items-center gap-2"
                                    >
                                        <AlertCircle size={18} />
                                        <span>{error}</span>
                                    </motion.div>
                                )}
                                
                                <motion.div variants={fadeInUp} className="pt-2">
                                    <button 
                                        type="submit" 
                                        disabled={isLoading}
                                        className="w-full py-4 bg-[#0f172a] hover:bg-black text-white font-semibold rounded-[1rem] shadow-[0_4px_14px_0_rgb(0,0,0,0.2)] hover:shadow-[0_6px_20px_rgba(0,0,0,0.23)] hover:-translate-y-0.5 transition-all duration-200 flex items-center justify-center gap-2 disabled:opacity-70 disabled:hover:translate-y-0 disabled:shadow-none text-[15px]"
                                    >
                                        {isLoading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : "Sign Up"}
                                    </button>
                                </motion.div>
                            </form>

                            <motion.div variants={fadeInUp} className="mt-8 text-center text-[14px] font-medium text-slate-500 flex justify-center items-center gap-1.5 pb-2">
                                Already have an account?{" "}
                                <Link to="/login" className="text-slate-900 font-bold hover:underline">
                                    Sign in here
                                </Link>
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </div>
            </div>
            
            {/* Mobile Header elements (only visible on mobile to keep branding) */}
            <div className="absolute top-6 left-6 right-6 flex justify-between items-center z-20 sm:hidden">
                <Link to="/" className="flex items-center gap-2 text-xl font-bold tracking-tight text-white">
                    <div className="size-6 rounded-md bg-white flex items-center justify-center shadow-lg">
                        <span className="text-slate-900 text-sm leading-none font-black">+</span>
                    </div>
                    HealthSync
                </Link>
            </div>
        </div>
    );
}
