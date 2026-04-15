import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Stethoscope, Pill, Droplet, ArrowRight } from "lucide-react";

export default function FeatureCards() {
    const features = [
        {
            title: "Doctor Appointments",
            description: "Schedule consultations with verified professionals seamlessly.",
            icon: Stethoscope,
            color: "blue",
            link: "/doctor"
        },
        {
            title: "Pharmacy Management",
            description: "Explore inventory, check stock availability, and manage medications.",
            icon: Pill,
            color: "teal",
            link: "/pharmacy"
        },
        {
            title: "Blood Donation",
            description: "Connect with verified donors instantly for emergency life saving.",
            icon: Droplet,
            color: "rose",
            link: "/blood"
        }
    ];

    const containerVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: { staggerChildren: 0.2 }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 40 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: "easeOut" } }
    };

    const colorConfig = {
        blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white shadow-blue-100 border-blue-100",
        teal: "bg-teal-50 text-teal-600 group-hover:bg-teal-600 group-hover:text-white shadow-teal-100 border-teal-100",
        rose: "bg-rose-50 text-rose-600 group-hover:bg-rose-600 group-hover:text-white shadow-rose-100 border-rose-100"
    };

    return (
        <section id="explore-services" className="relative z-20 -mt-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 scroll-mt-32">
            <motion.div 
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
                className="grid grid-cols-1 md:grid-cols-3 gap-8"
            >
                {features.map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                        <motion.div key={index} variants={itemVariants}>
                            <Link 
                                to={feature.link}
                                className="group block bg-white/80 backdrop-blur-xl border border-slate-100 p-8 flex flex-col rounded-[2.5rem] shadow-xl hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
                            >
                                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 transition-colors duration-500 ${colorConfig[feature.color].split(' ').slice(0, 4).join(' ')}`}>
                                    <Icon size={32} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-800 mb-4 tracking-tight">{feature.title}</h3>
                                <p className="text-slate-500 leading-relaxed mb-8 flex-grow">{feature.description}</p>
                                
                                <div className="mt-auto flex items-center text-slate-800 font-bold group-hover:text-blue-600 transition-colors">
                                    Explore Module
                                    <ArrowRight size={18} className="ml-2 group-hover:translate-x-2 transition-transform duration-300" />
                                </div>
                            </Link>
                        </motion.div>
                    );
                })}
            </motion.div>
        </section>
    );
}
