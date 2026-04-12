import { motion } from "framer-motion";
import { ShieldCheck, Zap, CalendarCheck, Search } from "lucide-react";

export default function KeyFeatures() {
    const features = [
        {
            icon: ShieldCheck,
            title: "Secure Authentication",
            desc: "Role-based access protects sensitive health data and ensures privacy across the platform."
        },
        {
            icon: Zap,
            title: "Real-time Data",
            desc: "Instant updates for appointments, pharmacy stocks, and blood donor availability."
        },
        {
            icon: CalendarCheck,
            title: "Easy Booking",
            desc: "Avoid lines with our direct doctor scheduling system, managed via premium dashboards."
        },
        {
            icon: Search,
            title: "Smart Search",
            desc: "Instantly filter large inventories and donor pools to find exactly what you need."
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.15 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9, y: 20 },
        visible: { opacity: 1, scale: 1, y: 0, transition: { duration: 0.5 } }
    };

    return (
        <section className="py-24 bg-white/50 border-y border-white/60">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16">
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight mb-4">Why choose HealthSync?</h2>
                </div>

                <motion.div 
                    variants={containerVariants}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, margin: "-50px" }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {features.map((item, i) => {
                        const Icon = item.icon;
                        return (
                            <motion.div key={i} variants={itemVariants} className="flex flex-col items-center text-center">
                                <div className="w-16 h-16 rounded-[1.5rem] bg-blue-50 text-blue-600 flex justify-center items-center mb-6 shadow-sm border border-blue-100">
                                    <Icon size={28} />
                                </div>
                                <h4 className="text-lg font-bold text-slate-800 mb-2">{item.title}</h4>
                                <p className="text-sm text-slate-500 leading-relaxed max-w-xs">{item.desc}</p>
                            </motion.div>
                        );
                    })}
                </motion.div>
            </div>
        </section>
    );
}
