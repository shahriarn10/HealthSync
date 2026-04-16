import { Activity } from "lucide-react";
import { Link } from "react-router-dom";

export default function Footer() {
    return (
        <footer className="bg-white border-t border-slate-200/60 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
                    <div className="col-span-1 md:col-span-1">
                        <Link to="/" className="flex items-center gap-2 group mb-6">
                            <div className="p-2 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-xl shadow-md group-hover:shadow-lg transition-all">
                                <Activity className="text-white" size={24} />
                            </div>
                            <span className="font-bold text-xl text-slate-800 tracking-tight">Health<span className="text-sky-500">Sync</span></span>
                        </Link>
                        <p className="text-slate-500 text-sm leading-relaxed pr-4">
                            Empowering healthcare through seamless technology. Managing appointments, pharmacy, and life-saving donations in one place.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Platform</h4>
                        <ul className="space-y-3 text-sm text-slate-500">
                            <li><Link to="/doctor" className="hover:text-sky-600 transition-colors">Doctors</Link></li>
                            <li><Link to="/pharmacy" className="hover:text-sky-600 transition-colors">Pharmacy</Link></li>
                            <li><Link to="/blood" className="hover:text-sky-600 transition-colors">Blood Bank</Link></li>
                        </ul>
                    </div>

                    

                    <div>
                        <h4 className="font-bold text-slate-900 mb-4">Connect</h4>
                        <div className="flex gap-4 text-slate-400 font-medium text-sm">
                            <a href="#" className="hover:text-sky-500 transition-colors">Twitter</a>
                            <a href="#" className="hover:text-slate-900 transition-colors">GitHub</a>
                            <a href="#" className="hover:text-sky-700 transition-colors">LinkedIn</a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-slate-100 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-slate-400">© {new Date().getFullYear()} HealthSync. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
