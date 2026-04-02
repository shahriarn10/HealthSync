import { useEffect, useState } from "react";
import { getPharmacyData, addMedicine, deleteMedicine } from "../../api";

export default function PharmacyPage() {
    const [meds, setMeds] = useState([]);
    const [form, setForm] = useState({ name: "", type: "", quantity: "", price: "" });
    const user = JSON.parse(localStorage.getItem("user"));

    const load = async () => {
        const res = await getPharmacyData(user.token); setMeds(res.data);
    };
    useEffect(() => { load(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        await addMedicine(user.token, form);
        setForm({ name: "", type: "", quantity: "", price: "" });
        load();
    };

    const handleDelete = async (id) => {
        await deleteMedicine(user.token, id);
        load();
    };

    return (
        <div style={{ margin: "2rem" }}>
            <h2>Pharmacy Inventory</h2>
            <form onSubmit={handleAdd}>
                <input placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
                <input placeholder="Type" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} />
                <input placeholder="Qty" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })} />
                <input placeholder="Price" value={form.price} onChange={e => setForm({ ...form, price: e.target.value })} />
                <button type="submit">Add</button>
            </form>
            <ul>
                {meds.map(m => (
                    <li key={m._id}>
                        {m.name} ({m.quantity}) — ${m.price}
                        <button onClick={() => handleDelete(m._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
