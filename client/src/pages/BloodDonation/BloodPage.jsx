import { useEffect, useState } from "react";
import { getBloodData, addDonor, deleteDonor } from "../../api";

export default function BloodPage() {
    const [donors, setDonors] = useState([]);
    const [form, setForm] = useState({ donorName: "", bloodType: "", location: "" });
    const user = JSON.parse(localStorage.getItem("user"));

    const load = async () => {
        const res = await getBloodData(user.token); setDonors(res.data);
    };
    useEffect(() => { load(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        await addDonor(user.token, form);
        setForm({ donorName: "", bloodType: "", location: "" });
        load();
    };

    const handleDelete = async (id) => {
        await deleteDonor(user.token, id);
        load();
    };

    return (
        <div style={{ margin: "2rem" }}>
            <h2>Blood Donation Registry</h2>
            <form onSubmit={handleAdd}>
                <input placeholder="Donor Name" value={form.donorName} onChange={e => setForm({ ...form, donorName: e.target.value })} />
                <input placeholder="Blood Type" value={form.bloodType} onChange={e => setForm({ ...form, bloodType: e.target.value })} />
                <input placeholder="Location" value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} />
                <button type="submit">Add</button>
            </form>
            <ul>
                {donors.map(d => (
                    <li key={d._id}>
                        {d.donorName} — {d.bloodType} ({d.location})
                        <button onClick={() => handleDelete(d._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
