import { useEffect, useState, useCallback } from "react";
import { getAdminOverview, adminDeleteUser, adminDeleteItem } from "../../api";

export default function AdminDashboard() {
    const [data, setData] = useState(null);
    const [error, setError] = useState("");
    const user = JSON.parse(localStorage.getItem("user"));

    if (!user || user.role !== "admin") {
        return <h3 style={{ margin: "2rem", color: "red" }}>Access Denied – Admins Only</h3>;
    }

    const load = useCallback(async () => {
        try {
            const res = await getAdminOverview(user.token);
            setData(res.data);
        } catch (err) {
            setError("Failed to load admin data. Are you logged in as admin?");
        }
    }, [user.token]);

    useEffect(() => { load(); }, [load]);

    const delUser = async (id) => { await adminDeleteUser(user.token, id); load(); };
    const delItem = async (coll, id) => { await adminDeleteItem(user.token, coll, id); load(); };

    if (error) return <p style={{ color: "red", margin: "2rem" }}>{error}</p>;
    if (!data) return <p style={{ margin: "2rem" }}>Loading Admin Data…</p>;

    return (
        <div style={{ margin: "2rem" }}>
            <h2>Admin Dashboard</h2>

            <h3>📊 Statistics</h3>
            <ul>
                <li>Total Users: {data.stats.totalUsers}</li>
                <li>Appointments: {data.stats.appointments}</li>
                <li>Medicines: {data.stats.medicines}</li>
                <li>Blood Donors: {data.stats.donors}</li>
            </ul>

            <hr />

            <h3>👤 All Users</h3>
            <ul>
                {data.users.map(u => (
                    <li key={u._id}>
                        {u.name} — {u.email} ({u.role})
                        {u.role !== "admin" && (
                            <button onClick={() => delUser(u._id)} style={{ marginLeft: "1rem" }}>
                                Delete
                            </button>
                        )}
                    </li>
                ))}
            </ul>

            <hr />

            <h3>🩺 Appointments</h3>
            <ul>
                {data.appointments.map(a => (
                    <li key={a._id}>
                        {a.patientName} → Dr. {a.doctorName} on {a.date} at {a.time}
                        <button onClick={() => delItem("appointment", a._id)} style={{ marginLeft: "1rem" }}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <hr />

            <h3>💊 Medicines</h3>
            <ul>
                {data.medicines.map(m => (
                    <li key={m._id}>
                        {m.name} — {m.quantity} units @ ${m.price}
                        <button onClick={() => delItem("medicine", m._id)} style={{ marginLeft: "1rem" }}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>

            <hr />

            <h3>🩸 Blood Donors</h3>
            <ul>
                {data.donors.map(d => (
                    <li key={d._id}>
                        {d.donorName} — {d.bloodType} ({d.location})
                        <button onClick={() => delItem("blood", d._id)} style={{ marginLeft: "1rem" }}>
                            Delete
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
