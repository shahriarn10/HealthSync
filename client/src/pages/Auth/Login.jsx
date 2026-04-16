import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../../api";
import { motion } from "framer-motion";
import { Mail, Lock, AlertCircle, ArrowRight, Home } from "lucide-react";

export default function Login() {
    const [form, setForm] = useState({ email: "", password: "" });
    const [error, setError] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError("");
        try {
            const { data } = await login(form);
            localStorage.setItem("user", JSON.stringify(data));
            navigate("/");
        } catch (err) {
            setError(err.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    // Animation variants
    const containerVariants = {
        hidden: { opacity: 0 },
        visible: { 
            opacity: 1,
            transition: { staggerChildren: 0.1, delayChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { y: 20, opacity: 0 },
        visible: { y: 0, opacity: 1, transition: { type: "spring", stiffness: 300, damping: 24 } }
    };

    return (
        <div className="min-h-screen flex text-slate-800 bg-slate-50">
            {/* Left Panel - Image/Branding (Hidden on mobile) */}
            <div className="hidden lg:flex w-1/2 relative bg-slate-900 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-600/90 to-slate-900/90 z-10 mix-blend-multiply" />
                <img 
                    src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=1200&q=80" 
                    alt="HealthSync Medical Background" 
                    className="absolute inset-0 w-full h-full object-cover"
                />
                
                {/* Decorative floating elements */}
                <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-sky-400 rounded-full mix-blend-screen filter blur-[80px] opacity-30 animate-pulse z-10" />
                <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-[100px] opacity-20 z-10" />

                <div className="relative z-20 flex flex-col justify-between p-12 w-full h-full text-white">
                    <Link to="/" className="flex items-center gap-2 text-2xl font-bold tracking-tight hover:opacity-80 transition-opacity w-fit">
                        <div className="size-8 rounded-lg bg-gradient-to-br from-sky-400 to-blue-600 flex items-center justify-center shadow-lg shadow-sky-500/30">
                            <span className="text-white text-lg leading-none">+</span>
                        </div>
                        HealthSync
                    </Link>

                    <div className="max-w-md">
                        <motion.h1 
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="text-4xl font-bold mb-6 leading-tight"
                        >
                            Your health, perfectly synchronized.
                        </motion.h1>
                        <motion.p 
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.4 }}
                            className="text-slate-300 text-lg leading-relaxed"
                        >
                            Access your medical records, book appointments, and manage your health journey all in one secure platform.
                        </motion.p>
                    </div>

                    <div className="flex items-center gap-4 text-sm text-slate-400">
                        <span>© 2026 HealthSync System</span>
                        <div className="w-1 h-1 rounded-full bg-slate-500" />
                        <span>Secure & Encrypted</span>
                    </div>
                </div>
            </div>

            {/* Right Panel - Login Form */}
            <div className="w-full lg:w-1/2 flex flex-col items-center justify-center p-6 sm:p-12 relative overflow-hidden bg-slate-50/50">
                {/* Mobile back to home */}
                <div className="absolute top-6 left-6 lg:hidden">
                    <Link to="/" className="p-2 rounded-full bg-white shadow-sm border border-slate-200 text-slate-500 hover:text-sky-600 transition-colors flex items-center justify-center">
                        <Home size={20} />
                    </Link>
                </div>

                <div className="w-full max-w-md">
                    <motion.div 
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 sm:p-10 relative z-10"
                    >
                        <motion.div variants={itemVariants} className="text-center mb-8">
                            <h2 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
                                Welcome back
                            </h2>
                            <p className="text-sm text-slate-500 mt-3 font-medium">
                                Enter your credentials to access your account
                            </p>
                        </motion.div>
                        
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <motion.div variants={itemVariants} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-1.5 ml-1">Email Address</label>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                            <Mail size={18} />
                                        </div>
                                        <input 
                                            name="email" 
                                            type="email"
                                            placeholder="you@example.com" 
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 shadow-sm"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <div className="flex justify-between items-center mb-1.5 ml-1">
                                        <label className="block text-sm font-semibold text-slate-700">Password</label>
                                        
                                    </div>
                                    <div className="relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400 group-focus-within:text-sky-500 transition-colors">
                                            <Lock size={18} />
                                        </div>
                                        <input 
                                            name="password" 
                                            type="password" 
                                            placeholder="••••••••" 
                                            onChange={handleChange}
                                            className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200/80 bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-sky-500/20 focus:border-sky-500 transition-all duration-300 shadow-sm"
                                            required
                                            disabled={isLoading}
                                        />
                                    </div>
                                </div>
                            </motion.div>
                            
                            {error && (
                                <motion.div 
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: "auto" }}
                                    className="p-3.5 rounded-xl bg-red-50/80 border border-red-100 text-red-600 text-sm font-medium flex items-start gap-2.5 shadow-sm"
                                >
                                    <AlertCircle size={18} className="shrink-0 mt-0.5" />
                                    <span>{error}</span>
                                </motion.div>
                            )}
                            
                            <motion.div variants={itemVariants} className="pt-2">
                                <button 
                                    type="submit" 
                                    disabled={isLoading}
                                    className="w-full py-3.5 bg-slate-900 hover:bg-sky-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-sky-500/25 transition-all duration-300 flex items-center justify-center gap-2 group disabled:opacity-70 disabled:cursor-not-allowed"
                                >
                                    {isLoading ? (
                                        <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    ) : (
                                        <>
                                            Sign In
                                            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </button>
                            </motion.div>
                        </form>

                        <motion.div variants={itemVariants} className="mt-8 text-center text-sm font-medium text-slate-500">
                            Don't have an account?{" "}
                            <Link to="/register" className="text-sky-600 hover:text-sky-700 transition-colors">
                                Create an account
                            </Link>
                        </motion.div>
                    </motion.div>
                </div>
                
                {/* Decorative background blobs for right side */}
                <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-sky-200/40 rounded-full mix-blend-multiply filter blur-[100px] opacity-50 z-0 pointer-events-none" />
                <div className="absolute -bottom-32 -left-32 w-[400px] h-[400px] bg-blue-200/40 rounded-full mix-blend-multiply filter blur-[80px] opacity-50 z-0 pointer-events-none" />
            </div>
        </div>
    );
}
