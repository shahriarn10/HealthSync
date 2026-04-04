import { useEffect, useState } from "react";
import { getBloodData, addDonor, deleteDonor } from "../../api";

import { Droplet, MapPin, User, Stethoscope, HeartHandshake, UserPlus, Trash2 } from "lucide-react";

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

    const typeColors = {
        "A+": "bg-rose-100 text-rose-700",
        "O+": "bg-blue-100 text-blue-700",
        "B+": "bg-amber-100 text-amber-700",
        "AB+": "bg-purple-100 text-purple-700",
        "A-": "bg-rose-50 text-rose-600 border border-rose-200",
        "O-": "bg-blue-50 text-blue-600 border border-blue-200",
        "B-": "bg-amber-50 text-amber-600 border border-amber-200",
        "AB-": "bg-purple-50 text-purple-600 border border-purple-200",
    };

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-rose-100 text-rose-600 rounded-xl">
                    <HeartHandshake size={28} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Blood Donor Registry</h2>
                    <p className="text-slate-500">Manage blood donors and their locations</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 sticky top-24">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <UserPlus size={20} className="text-rose-500" />
                            Register Donor
                        </h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Donor Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={16} className="text-slate-400" />
                                    </div>
                                    <input name="donorName" placeholder="Jane Doe" value={form.donorName}
                                        onChange={(e) => setForm({ ...form, donorName: e.target.value })} 
                                        className="input-field pl-10" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Blood Type</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Droplet size={16} className="text-rose-400" />
                                        </div>
                                        <input name="bloodType" placeholder="O+" value={form.bloodType}
                                            onChange={(e) => setForm({ ...form, bloodType: e.target.value })} 
                                            className="input-field pl-10" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Location</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <MapPin size={16} className="text-slate-400" />
                                        </div>
                                        <input name="location" placeholder="City Hospital" value={form.location}
                                            onChange={(e) => setForm({ ...form, location: e.target.value })} 
                                            className="input-field pl-10" required />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full btn-primary bg-rose-500 hover:bg-rose-600 mt-2">
                                Register Donor
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    {donors.length === 0 ? (
                        <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-200">
                            <Droplet size={48} className="text-slate-300 mb-4" />
                            <h3 className="text-lg font-medium text-slate-600">No donors registered</h3>
                            <p className="text-slate-500 text-sm mt-1">Use the form to register new blood donors.</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {donors.map(d => (
                                <div key={d._id} className="glass-card p-5 group hover:border-rose-200 transition-colors flex flex-col h-full bg-gradient-to-br from-white to-rose-50/30">
                                    <div className="flex justify-between items-start mb-3">
                                        <div className={`px-3 py-1.5 rounded-lg flex items-center gap-1.5 font-bold ${typeColors[d.bloodType] || "bg-slate-100 text-slate-700"}`}>
                                            <Droplet size={16} className="fill-current opacity-70" />
                                            {d.bloodType}
                                        </div>
                                        <button onClick={() => handleDelete(d._id)} className="btn-danger p-2 h-auto rounded-full" aria-label="Remove donor">
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                    <h4 className="text-lg font-bold text-slate-800 tracking-tight mt-1">{d.donorName}</h4>
                                    
                                    <div className="mt-4 pt-4 border-t border-slate-100 flex items-center gap-2 text-sm text-slate-600 font-medium">
                                        <MapPin size={16} className="text-slate-400" />
                                        {d.location}
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
