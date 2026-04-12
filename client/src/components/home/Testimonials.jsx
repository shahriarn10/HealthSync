import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export default function Testimonials() {
    const testimonials = [
        {
            id: 1,
            name: "Sarah Jenkins",
            role: "Patient",
            text: "HealthSync completely changed how I manage my appointments. I can find an available doctor and book instantly without waiting on hold.",
            rating: 5,
            initial: "S"
        },
        {
            id: 2,
            name: "Dr. Ahmed Khan",
            role: "Cardiologist",
            text: "The unified dashboard makes patient management a breeze. I can check past history and prescribe instantly through the pharmacy integration.",
            rating: 5,
            initial: "A"
        },
        {
            id: 3,
            name: "Emily Chen",
            role: "Blood Donor",
            text: "The emergency blood matching system is incredible. I was notified immediately when a local hospital needed my exact blood type.",
            rating: 5,
            initial: "E"
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
        hidden: { opacity: 0, y: 30 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
    };

    return (
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-1/2 left-0 w-72 h-72 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-y-1/2 -ml-20"></div>
            <div className="absolute top-1/2 right-0 w-72 h-72 bg-emerald-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 transform -translate-y-1/2 -mr-20"></div>

            <div className="text-center mb-16 relative z-10">
                <h2 className="text-3xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-4">Trusted by Thousands</h2>
                <p className="text-lg text-slate-500 max-w-2xl mx-auto">See how we are transforming the healthcare experience for doctors, patients, and hospitals.</p>
            </div>

            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-50px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10"
            >
                {testimonials.map((item) => (
                    <motion.div 
                        key={item.id} 
                        variants={itemVariants}
                        className="bg-white rounded-[2rem] p-8 shadow-xl shadow-slate-200/40 border border-slate-100 flex flex-col hover:-translate-y-1 transition-transform duration-300"
                    >
                        <div className="text-sky-500 mb-6">
                            <Quote size={32} strokeWidth={1.5} className="opacity-40" />
                        </div>
                        <p className="text-slate-600 leading-relaxed mb-8 flex-grow">
                            "{item.text}"
                        </p>
                        <div className="flex items-center gap-4 mt-auto pt-6 border-t border-slate-50">
                            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-bold text-lg shadow-sm">
                                {item.initial}
                            </div>
                            <div>
                                <h4 className="font-bold text-slate-900 text-sm">{item.name}</h4>
                                <div className="text-xs font-medium text-slate-500 mb-1">{item.role}</div>
                                <div className="flex gap-1">
                                    {[...Array(item.rating)].map((_, i) => (
                                        <Star key={i} size={12} className="fill-amber-400 text-amber-400" />
                                    ))}
                                </div>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
