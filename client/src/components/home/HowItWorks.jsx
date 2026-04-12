import { motion } from "framer-motion";
import { UserCheck, LayoutGrid, CalendarRange, Settings } from "lucide-react";

export default function HowItWorks() {
    const steps = [
        {
            id: 1,
            title: "Sign Up / Login",
            icon: UserCheck,
            text: "Create your account and securely log in.",
            color: "from-blue-400 to-indigo-500"
        },
        {
            id: 2,
            title: "Choose a Service",
            icon: LayoutGrid,
            text: "Select from Doctor Appointments, Blood Bank, or Pharmacy.",
            color: "from-indigo-400 to-purple-500"
        },
        {
            id: 3,
            title: "Take Action",
            icon: CalendarRange,
            text: "Book appointments, request blood, or order medicines.",
            color: "from-purple-400 to-pink-500"
        },
        {
            id: 4,
            title: "Manage Easily",
            icon: Settings,
            text: "Track everything from your personalized dashboard.",
            color: "from-pink-400 to-rose-500"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2, delayChildren: 0.1 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 30, scale: 0.95 },
        visible: { opacity: 1, y: 0, scale: 1, transition: { duration: 0.6, ease: "easeOut" } }
    };

    const lineVariants = {
        hidden: { scaleX: 0, originX: 0 },
        visible: { scaleX: 1, originX: 0, transition: { duration: 0.8, ease: "easeOut", delay: 0.5 } }
    };

    return (
        <section className="py-24 relative overflow-hidden max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-sky-100 rounded-full mix-blend-multiply filter blur-3xl opacity-30"></div>

            <div className="text-center mb-20 relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">How HealthSync Works</h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">Get access to essential healthcare services in just a few simple steps.</p>
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="relative z-10"
            >
                {/* Connecting Line (Desktop Only) */}
                <div className="hidden lg:block absolute top-[4.5rem] left-[10%] right-[10%] h-[2px] bg-slate-100 -z-10">
                    <motion.div 
                        variants={lineVariants}
                        className="h-full bg-gradient-to-r from-blue-400 via-purple-400 to-rose-400 opacity-60"
                    />
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-12 lg:gap-8">
                    {steps.map((step, index) => {
                        const Icon = step.icon;
                        return (
                            <motion.div 
                                key={step.id} 
                                variants={itemVariants}
                                className="relative flex flex-col items-center group cursor-default"
                            >
                                {/* Step Number Indicator */}
                                <div className="absolute -top-4 -left-2 w-8 h-8 rounded-full bg-white border border-slate-100 shadow-sm flex items-center justify-center text-xs font-black text-slate-400 z-20">
                                    {step.id}
                                </div>

                                {/* Icon Container with Glow Focus */}
                                <div className="mb-6 relative">
                                    <div className="absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-40 transition-opacity duration-300 blur-xl rounded-full scale-150"></div>
                                    <div className="w-24 h-24 bg-white border border-slate-100 rounded-[2rem] shadow-xl group-hover:shadow-2xl transition-all duration-300 group-hover:-translate-y-2 flex items-center justify-center relative z-10 overflow-hidden">
                                        <div className={`absolute inset-0 bg-gradient-to-br ${step.color} opacity-10 group-hover:opacity-20 transition-opacity`}></div>
                                        <Icon size={36} className={`text-transparent bg-clip-text bg-gradient-to-br ${step.color} drop-shadow-sm`} style={{ stroke: "url(#gradient-" + step.id + ")" }} />
                                        
                                        {/* SVG Gradient definition for the icon stroke */}
                                        <svg width="0" height="0">
                                            <linearGradient id={"gradient-" + step.id} x1="0%" y1="0%" x2="100%" y2="100%">
                                                {step.id === 1 && <><stop stopColor="#60A5FA" offset="0%" /><stop stopColor="#6366F1" offset="100%" /></>}
                                                {step.id === 2 && <><stop stopColor="#818CF8" offset="0%" /><stop stopColor="#A855F7" offset="100%" /></>}
                                                {step.id === 3 && <><stop stopColor="#C084FC" offset="0%" /><stop stopColor="#EC4899" offset="100%" /></>}
                                                {step.id === 4 && <><stop stopColor="#F472B6" offset="0%" /><stop stopColor="#F43F5E" offset="100%" /></>}
                                            </linearGradient>
                                        </svg>
                                    </div>
                                </div>

                                {/* Text Content */}
                                <h3 className="text-xl font-bold text-slate-800 mb-2 text-center group-hover:text-blue-600 transition-colors">{step.title}</h3>
                                <p className="text-slate-500 text-center text-sm leading-relaxed max-w-[200px]">{step.text}</p>
                            </motion.div>
                        );
                    })}
                </div>
            </motion.div>
        </section>
    );
}
