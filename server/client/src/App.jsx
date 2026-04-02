import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
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
            <Navbar />
            <Routes>
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                <Route path="/" element={<PrivateRoute><h2>Welcome to HealthSync</h2></PrivateRoute>} />
                <Route path="/doctor" element={<PrivateRoute><DoctorPage /></PrivateRoute>} />
                <Route path="/pharmacy" element={<PrivateRoute><PharmacyPage /></PrivateRoute>} />
                <Route path="/blood" element={<PrivateRoute><BloodPage /></PrivateRoute>} />
                <Route path="/admin" element={<PrivateRoute><AdminDashboard /></PrivateRoute>} />
            </Routes>
        </BrowserRouter>
    );
}
