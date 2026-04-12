import { BrowserRouter, Routes, Route, Navigate, Link } from "react-router-dom";
import Navbar from "./components/Navbar";
import Login from "./pages/Auth/Login";
import Register from "./pages/Auth/Register";
import DoctorPage from "./pages/DoctorAppointment/DoctorPage";
import PharmacyPage from "./pages/Pharmacy/PharmacyPage";
import BloodPage from "./pages/BloodDonation/BloodPage";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import Home from "./pages/Home";

const PrivateRoute = ({ children }) => {
    const user = JSON.parse(localStorage.getItem("user"));
    return user ? children : <Navigate to="/login" />;
};

export default function App() {
    return (
        <BrowserRouter>
            <div className="min-h-screen flex flex-col pt-16 font-sans">
                <Navbar />
                <main className="flex-grow w-full block">
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                                <Login />
                            </div>
                        } />
                        <Route path="/register" element={
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                                <Register />
                            </div>
                        } />
                        <Route path="/doctor" element={
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                                <PrivateRoute><DoctorPage /></PrivateRoute>
                            </div>
                        } />
                        <Route path="/pharmacy" element={
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                                <PrivateRoute><PharmacyPage /></PrivateRoute>
                            </div>
                        } />
                        <Route path="/blood" element={
                            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 animate-in fade-in duration-500">
                                <PrivateRoute><BloodPage /></PrivateRoute>
                            </div>
                        } />
                        <Route path="/admin" element={
                            <div className="animate-in fade-in duration-500">
                                <PrivateRoute><AdminDashboard /></PrivateRoute>
                            </div>
                        } />
                    </Routes>
                </main>
            </div>
        </BrowserRouter>
    );
}
