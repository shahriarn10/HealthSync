import { useEffect, useState } from "react";
import { getPharmacyData, addMedicine, deleteMedicine } from "../../api";

import { Pill, PackagePlus, DollarSign, Package, Trash2, Stethoscope, Tag } from "lucide-react";

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
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-emerald-100 text-emerald-600 rounded-xl">
                    <Pill size={28} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Pharmacy Inventory</h2>
                    <p className="text-slate-500">Manage medicine stock and prices</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 sticky top-24">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <PackagePlus size={20} className="text-emerald-500" />
                            Add Medicine
                        </h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Medicine Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Pill size={16} className="text-slate-400" />
                                    </div>
                                    <input name="name" placeholder="Amoxicillin" value={form.name}
                                        onChange={(e) => setForm({ ...form, name: e.target.value })} 
                                        className="input-field pl-10" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Type / Category</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Tag size={16} className="text-slate-400" />
                                    </div>
                                    <input name="type" placeholder="Antibiotic" value={form.type}
                                        onChange={(e) => setForm({ ...form, type: e.target.value })} 
                                        className="input-field pl-10" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Quantity</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Package size={16} className="text-slate-400" />
                                        </div>
                                        <input type="number" name="quantity" placeholder="100" value={form.quantity}
                                            onChange={(e) => setForm({ ...form, quantity: e.target.value })} 
                                            className="input-field pl-10" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Price ($)</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <DollarSign size={16} className="text-slate-400" />
                                        </div>
                                        <input type="number" step="0.01" name="price" placeholder="15.50" value={form.price}
                                            onChange={(e) => setForm({ ...form, price: e.target.value })} 
                                            className="input-field pl-10" required />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full btn-primary bg-emerald-500 hover:bg-emerald-600 mt-2">
                                Add to Inventory
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    {meds.length === 0 ? (
                        <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-200">
                            <Pill size={48} className="text-slate-300 mb-4" />
                            <h3 className="text-lg font-medium text-slate-600">No medicines in inventory</h3>
                            <p className="text-slate-500 text-sm mt-1">Use the form to add medicines to stock.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {meds.map(m => (
                                <div key={m._id} className="glass-card p-5 group hover:border-emerald-200 transition-colors flex flex-col h-full">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 p-2.5 rounded-lg">
                                            <Pill size={20} />
                                        </div>
                                        <button onClick={() => handleDelete(m._id)} className="btn-danger p-2 h-auto rounded-full" aria-label="Delete medicine">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 tracking-tight">{m.name}</h4>
                                    <div className="inline-flex max-w-fit px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 text-xs font-medium uppercase tracking-wider my-2">
                                        {m.type}
                                    </div>
                                    <div className="mt-auto pt-4 border-t border-slate-100 flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-1.5 text-slate-600 font-medium">
                                            <Package size={16} className="text-slate-400" />
                                            {m.quantity} in stock
                                        </div>
                                        <div className="flex items-center gap-1 font-bold text-emerald-600 text-lg">
                                            <span>$</span>{m.price}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
