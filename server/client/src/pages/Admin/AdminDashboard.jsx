export default function AdminDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") return <h3>Access denied</h3>;

    return (
        <div style={{ margin: "2rem" }}>
            <h2>Admin Dashboard</h2>
            <p>Manage doctors, pharmacy stock, blood donations, and platform users.</p>
        </div>
    );
}
