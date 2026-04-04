import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DoctorPage from "./pages/DoctorAppointment/DoctorPage";
import PharmacyPage from "./pages/Pharmacy/PharmacyPage";
import BloodPage from "./pages/BloodDonation/BloodPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";

const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? children : <Navigate to="/login" />;
};

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col pt-16">
                <Navbar />
                <main className="flex-grow w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500 slide-in-from-bottom-4">
                    <Routes>
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />

                        {/* Temporarily bypassed PrivateRoute for Homepage preview */}
                        <Route path="/" element={
                            <div className="flex flex-col items-center min-h-[70vh] py-12">
                                <div className="text-center mb-16 max-w-3xl">
                                    <h2 className="text-5xl md:text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-sky-500 to-indigo-600 mb-6 tracking-tight">
                                        Welcome to HealthSync
                                    </h2>
                                    <p className="text-lg text-slate-600 leading-relaxed">
                                        Your complete healthcare platform. Please select a service module below to get started.
                                    </p>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full max-w-5xl px-4">
                                    {/* Doctor Card */}
                                    <Link to="/doctor" className="glass-card p-8 flex flex-col items-center text-center hover:border-sky-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                        <div className="h-16 w-16 bg-sky-100 text-sky-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M11 2a2 2 0 0 0-2 2v5H4v11c0 1.1.9 2 2 2h12a2 2 0 0 0 2-2V9h-5V4a2 2 0 0 0-2-2h-2z"></path><path d="M11 2v5h2V2"></path><path d="M15 9V4"></path><path d="M9 9V4"></path><path d="M12 18v-4"></path><path d="M10 16h4"></path></svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-3">Doctor Appointments</h3>
                                        <p className="text-slate-500 text-sm">Schedule and manage your upcoming consultations with healthcare professionals.</p>
                                    </Link>

                                    {/* Pharmacy Card */}
                                    <Link to="/pharmacy" className="glass-card p-8 flex flex-col items-center text-center hover:border-emerald-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                        <div className="h-16 w-16 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m10.5 20.5 10-10a4.95 4.95 0 1 0-7-7l-10 10a4.95 4.95 0 1 0 7 7Z"></path><path d="m8.5 8.5 7 7"></path></svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-3">Pharmacy Inventory</h3>
                                        <p className="text-slate-500 text-sm">Check medicine availability, prices, and explore our full pharmacy stock.</p>
                                    </Link>

                                    {/* Blood Card */}
                                    <Link to="/blood" className="glass-card p-8 flex flex-col items-center text-center hover:border-rose-300 hover:shadow-xl transition-all duration-300 hover:-translate-y-1 group">
                                        <div className="h-16 w-16 bg-rose-100 text-rose-600 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22a7 7 0 0 0 7-7c0-2-1-3.9-3-5.5s-3.5-4-4-6.5c-.5 2.5-2 4.9-4 6.5C6 11.1 5 13 5 15a7 7 0 0 0 7 7z"></path></svg>
                                        </div>
                                        <h3 className="text-xl font-bold text-slate-800 mb-3">Blood Bank</h3>
                                        <p className="text-slate-500 text-sm">Search the blood donor registry and find emergency blood matches efficiently.</p>
                                    </Link>
                                </div>
                            </div>
                        } />
                        <Route path="/doctor" element={<PrivateRoute><DoctorPage /></PrivateRoute>} />
                        <Route path="/pharmacy" element={<PrivateRoute><PharmacyPage /></PrivateRoute>} />
                        <Route path="/blood" element={<PrivateRoute><BloodPage /></PrivateRoute>} />
                        {/* Temporarily bypassed PrivateRoute for Admin dashboard preview */}
                        <Route path="/admin" element={<AdminDashboard />} />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
