import { motion } from "framer-motion";
import { ArrowRight, Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function HeroSection() {
    const user = JSON.parse(localStorage.getItem("user"));
    return (
        <section className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pb-48 overflow-hidden rounded-[3rem] mt-8">
            {/* Background Animations */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob"></div>
                <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-purple-400 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-8 left-1/2 w-96 h-96 bg-teal-300 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-blue-600 font-medium text-sm mb-8 shadow-sm">
                        <Activity size={16} />
                        <span className="tracking-wide">HealthSync Platform 2.0</span>
                    </div>
                </motion.div>

                <motion.h1
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
                    className="text-5xl md:text-7xl font-extrabold text-slate-900 tracking-tight mb-8"
                >
                    Smart Healthcare, <br className="hidden md:block" />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                        Simplified
                    </span>
                </motion.h1>

                <motion.p
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
                    className="mt-4 text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-10"
                >
                    Book appointments, find blood donors, and manage medicines — all in one unified, secure platform.
                </motion.p>

                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
                    className="flex flex-col sm:flex-row justify-center gap-4 mt-8"
                >
                    {!user && (
                        <Link
                            to="/register"
                            className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-2xl shadow-lg shadow-blue-200 hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
                        >
                            Get Started
                            <ArrowRight size={20} />
                        </Link>
                    )}
                    <a
                        href="#explore-services"
                        className="inline-flex justify-center items-center gap-2 px-8 py-4 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 font-bold rounded-2xl shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-300"
                    >
                        Explore Services
                    </a>
                </motion.div>
            </div>
        </section>
    );
}
