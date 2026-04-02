import { useEffect, useState } from "react";
import { getAdminOverview, adminDeleteUser, adminDeleteItem } from "../../api";

export default function AdminDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [data, setData] = useState(null);

    if (!user || user.role !== "admin") return <h3>Access Denied – Admins Only</h3>;

    const load = async () => {
        const res = await getAdminOverview(user.token);
        setData(res.data);
    };

    const delUser = async (id) => { await adminDeleteUser(user.token, id); load(); };
    const delItem = async (coll, id) => { await adminDeleteItem(user.token, coll, id); load(); };

    useEffect(() => { load(); }, []);

    if (!data) return <p>Loading Admin Data…</p>;

    return (
        <div style={{ margin: "2rem" }}>
            <h2>Admin Dashboard</h2>

            <h3>Statistics</h3>
            <ul>
                <li>Users: {data.stats.totalUsers}</li>
                <li>Appointments: {data.stats.appointments}</li>
                <li>Medicines: {data.stats.medicines}</li>
                <li>Donors: {data.stats.donors}</li>
            </ul>

            <section>
                <h3>All Users</h3>
                <ul>
                    {data.users.map(u => (
                        <li key={u._id}>
                            {u.name} ({u.role}) – {u.email}
                            {u.role !== "admin" && <button onClick={() => delUser(u._id)}>Delete</button>}
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h3>Appointments</h3>
                <ul>
                    {data.appointments.map(a => (
                        <li key={a._id}>
                            {a.patientName} → {a.doctorName}
                            <button onClick={() => delItem("appointment", a._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h3>Medicines</h3>
                <ul>
                    {data.medicines.map(m => (
                        <li key={m._id}>
                            {m.name} ({m.quantity})
                            <button onClick={() => delItem("medicine", m._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </section>

            <section>
                <h3>Blood Donations</h3>
                <ul>
                    {data.donors.map(d => (
                        <li key={d._id}>
                            {d.donorName} – {d.bloodType}
                            <button onClick={() => delItem("blood", d._id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </section>
        </div>
    );
}
