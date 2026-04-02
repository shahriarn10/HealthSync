import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem("user"));

    const logout = () => {
        localStorage.removeItem("user");
        navigate("/login");
    };

    return (
        <nav style={{ display: "flex", gap: "1rem", padding: "1rem", background: "#edf2f4" }}>
            <Link to="/">Home</Link>
            {user && (
                <>
                    <Link to="/doctor">Doctor</Link>
                    <Link to="/pharmacy">Pharmacy</Link>
                    <Link to="/blood">Blood</Link>
                    {user.role === "admin" && <Link to="/admin">Admin</Link>}
                    <button onClick={logout}>Logout</button>
                </>
            )}
            {!user && <Link to="/login">Login</Link>}
        </nav>
    );
}
