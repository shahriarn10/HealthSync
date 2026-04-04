import { Link, useNavigate, useLocation } from "react-router-dom";
import { Activity, Stethoscope, Pill, Droplet, Shield, LogOut, LogIn, Home } from "lucide-react";

export default function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    const NavLink = ({ to, icon: Icon, children }) => {
        const isActive = location.pathname === to;
        return (
            <Link
                to={to}
                className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all duration-200 font-medium ${
                    isActive 
                    ? "bg-sky-100 text-sky-700 shadow-sm" 
                    : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                }`}
            >
                <Icon size={18} />
                <span>{children}</span>
            </Link>
        );
    };

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200/80 shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Logo */}
                    <div className="flex-shrink-0 flex items-center">
                        <Link to="/" className="flex items-center gap-2 group">
                            <div className="p-2 bg-gradient-to-br from-sky-400 to-indigo-500 rounded-xl shadow-md group-hover:shadow-lg transition-all">
                                <Activity className="text-white" size={24} />
                            </div>
                            <span className="font-bold text-xl text-slate-800 tracking-tight">Health<span className="text-sky-500">Sync</span></span>
                        </Link>
                    </div>

                    {/* Navigation Links */}
                    <div className="hidden md:flex items-center space-x-1">
                        <NavLink to="/" icon={Home}>Home</NavLink>
                        {user && (
                            <>
                                <NavLink to="/doctor" icon={Stethoscope}>Doctor</NavLink>
                                <NavLink to="/pharmacy" icon={Pill}>Pharmacy</NavLink>
                                <NavLink to="/blood" icon={Droplet}>Blood</NavLink>
                                {user.role === "admin" && (
                                    <NavLink to="/admin" icon={Shield}>Admin</NavLink>
                                )}
                            </>
                        )}
                    </div>

                    {/* Action Area */}
                    <div className="flex items-center space-x-4">
                        {user ? (
                            <div className="flex items-center gap-4">
                                <div className="hidden sm:block text-sm">
                                    <span className="text-slate-500">Welcome, </span>
                                    <span className="font-semibold text-slate-700">{user.name || user.email?.split('@')[0]}</span>
                                </div>
                                <button 
                                    onClick={logout}
                                    className="flex items-center gap-2 px-4 py-2 bg-slate-100 hover:bg-red-50 text-slate-700 hover:text-red-600 font-medium rounded-lg transition-colors border border-transparent hover:border-red-200 active:scale-95"
                                >
                                    <LogOut size={18} />
                                    <span className="hidden sm:inline">Logout</span>
                                </button>
                            </div>
                        ) : (
                            <Link 
                                to="/login"
                                className="flex items-center gap-2 px-5 py-2 bg-sky-500 hover:bg-sky-600 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-200 active:scale-95"
                            >
                                <LogIn size={18} />
                                <span>Login</span>
                            </Link>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
}
