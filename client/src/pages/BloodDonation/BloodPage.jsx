import { useEffect, useState } from "react";
import { getBloodData, addDonor } from "../../api";
import { Droplet, MapPin, Phone, Search, UserPlus, ImagePlus, ArrowLeft, ArrowRight, Loader2, Calendar, X } from "lucide-react";

export default function BloodPage() {
    const [donors, setDonors] = useState([]);
    const [filters, setFilters] = useState({ search: "", type: "All", status: "All" });
    const [showForm, setShowForm] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Edit Modal State
    const [editModal, setEditModal] = useState({ show: false, donor: null });
    
    const DEFAULT_PHOTO = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png";

    const [form, setForm] = useState({ 
        donorName: "", bloodType: "O+", location: "", phone: "", lastDonationDate: "", photo: "" 
    });
    
    const user = JSON.parse(localStorage.getItem("user"));

    const load = async () => {
        setIsLoading(true);
        try {
            const res = await getBloodData(user.token);
            const verified = res.data.filter(d => d.isVerified);
            setDonors(verified);
        } catch(e) { console.error("Error loading donors", e); }
        finally { setIsLoading(false); }
    };
    
    useEffect(() => { load(); }, []);

    // File Upload Handler (Base64)
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) { // 5MB limit
                alert("File size exceeds 5MB limit.");
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => setForm({ ...form, photo: reader.result });
        }
    };

    const handleAdd = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await addDonor(user.token, { ...form, photo: form.photo || DEFAULT_PHOTO });
            alert("Registration successful! Your profile will be visible once an Admin verifies it.");
            setForm({ donorName: "", bloodType: "O+", location: "", phone: "", lastDonationDate: "", photo: "" });
            setShowForm(false);
            load();
        } catch (e) { alert("Error registering donor"); }
        finally { setIsSubmitting(false); }
    };

    const handleDelete = async (id) => {
        try {
            await import("../../api.js").then(api => api.deleteDonor(user.token, id));
            load();
        } catch (err) { alert("Failed to remove donor"); }
    };

    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert("File size exceeds 5MB limit.");
                return;
            }
            const reader = new FileReader();
            reader.readAsDataURL(file);
            reader.onloadend = () => setEditModal({ ...editModal, donor: { ...editModal.donor, photo: reader.result } });
        }
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await import("../../api.js").then(api => api.updateDonor(user.token, editModal.donor._id, editModal.donor));
            setEditModal({ show: false, donor: null });
            load();
        } catch (err) { alert("Failed to update donor profile"); }
    };

    const checkEligibility = (lastDateStr) => {
        if (!lastDateStr) return { isEligible: true, lastDateFmt: "N/A", nextEligible: "Ready" };
        const lastDate = new Date(lastDateStr);
        const nextEligible = new Date(lastDate);
        nextEligible.setMonth(nextEligible.getMonth() + 3);
        const isEligible = new Date() >= nextEligible;
        
        const options = { year: 'numeric', month: 'short', day: 'numeric' };
        return {
            nextEligible: nextEligible.toLocaleDateString(undefined, options),
            isEligible,
            lastDateFmt: lastDate.toLocaleDateString(undefined, options)
        };
    };

    const typeColors = {
        "A+": "from-rose-500 to-rose-600", "O+": "from-red-500 to-red-600", 
        "B+": "from-orange-500 to-orange-600", "AB+": "from-pink-500 to-pink-600",
        "A-": "from-rose-700 to-rose-800", "O-": "from-red-700 to-red-800", 
        "B-": "from-orange-700 to-orange-800", "AB-": "from-pink-700 to-pink-800",
    };

    const filteredDonors = donors.filter(d => {
        if (filters.type !== "All" && d.bloodType !== filters.type) return false;
        if (filters.search && !d.location.toLowerCase().includes(filters.search.toLowerCase())) return false;
        const { isEligible } = checkEligibility(d.lastDonationDate);
        if (filters.status === "Available Donors" && (!isEligible || d.available === false)) return false;
        return true;
    });

    if (showForm) {
        return (
            <div className="max-w-3xl mx-auto animate-in fade-in zoom-in-95 duration-500 pb-16">
                <button onClick={() => setShowForm(false)} className="flex items-center gap-2 text-slate-500 hover:text-slate-800 font-medium mb-6 transition-colors">
                    <ArrowLeft size={18} /> Back to Directory
                </button>
                
                <div className="bg-white/80 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl overflow-hidden">
                    <div className="bg-gradient-to-r from-rose-600 to-red-600 p-8 text-center relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-8 opacity-10 blur-xl">
                            <Droplet size={120} className="text-white fill-white" />
                        </div>
                        <h2 className="text-3xl font-extrabold text-white tracking-tight relative z-10">Register as a Donor</h2>
                        <p className="text-rose-100 mt-2 font-medium relative z-10">Join the lifesavers community. Your contribution matters.</p>
                    </div>
                    
                    <form onSubmit={handleAdd} className="p-8 sm:p-10 space-y-6">
                        {/* Image Upload Area */}
                        <div className="flex flex-col items-center mb-8">
                            <div className="relative w-32 h-32 rounded-full border-4 border-rose-100 shadow-xl overflow-hidden group bg-slate-50 cursor-pointer">
                                {form.photo ? (
                                    <img src={form.photo} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 group-hover:text-rose-500 transition-colors">
                                        <ImagePlus size={32} />
                                        <span className="text-[10px] uppercase tracking-wider font-bold mt-2">Upload</span>
                                    </div>
                                )}
                                <input type="file" accept="image/*" onChange={handleImageChange} className="absolute inset-0 opacity-0 cursor-pointer" />
                            </div>
                            <p className="text-xs text-slate-400 font-medium mt-3 text-center max-w-xs">Upload a clear photo (Max 5MB). PNG, JPG, or JPEG.</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                                <input required name="donorName" placeholder="e.g. John Doe" value={form.donorName} onChange={(e) => setForm({ ...form, donorName: e.target.value })} className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 p-3.5 rounded-xl font-medium outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Blood Type</label>
                                <select required name="bloodType" value={form.bloodType} onChange={(e) => setForm({ ...form, bloodType: e.target.value })} className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 p-3.5 rounded-xl font-medium outline-none transition-all appearance-none cursor-pointer">
                                    {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(v => <option key={v} value={v}>{v}</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                                <input required name="phone" placeholder="+1 (555) 000-0000" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 p-3.5 rounded-xl font-medium outline-none transition-all" />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Last Donation Date</label>
                                <input required type="date" name="lastDonationDate" value={form.lastDonationDate} onChange={(e) => setForm({ ...form, lastDonationDate: e.target.value })} className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 p-3.5 rounded-xl font-medium text-slate-700 outline-none transition-all cursor-pointer" />
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location / City</label>
                            <input required name="location" placeholder="e.g. New York General Hospital" value={form.location} onChange={(e) => setForm({ ...form, location: e.target.value })} className="w-full bg-slate-50 border border-slate-200 focus:border-rose-400 focus:ring-4 focus:ring-rose-500/10 p-3.5 rounded-xl font-medium outline-none transition-all" />
                        </div>

                        <div className="pt-4">
                            <button disabled={isSubmitting} type="submit" className="w-full bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-bold py-4 rounded-xl shadow-lg shadow-rose-500/30 transition-all flex justify-center items-center gap-2 transform hover:-translate-y-0.5 active:translate-y-0">
                                {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Droplet size={20} className="fill-white" />}
                                {isSubmitting ? "Submitting..." : "Submit Registration Request"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto animate-in fade-in duration-700 pb-20">
            {/* Premium Hero Header */}
            <div className="flex justify-between items-center bg-white/60 backdrop-blur-md border border-white/50 p-6 sm:p-10 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] mb-10 overflow-hidden relative">
                <div className="absolute -right-20 -top-20 w-64 h-64 bg-rose-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                <div className="absolute -left-20 -bottom-20 w-64 h-64 bg-orange-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20"></div>
                
                <div className="relative z-10 w-full flex flex-col sm:flex-row justify-between items-center sm:items-start gap-6">
                    <div className="text-center sm:text-left">
                        <h2 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-slate-500 tracking-tight mb-2">
                            Donor Directory
                        </h2>
                        <p className="text-slate-500 font-medium">Find available lifesavers in your area instantly.</p>
                    </div>
                    <button onClick={() => setShowForm(true)} className="bg-slate-900 text-white hover:bg-slate-800 px-6 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-xl shadow-slate-900/20 transition-all transform hover:-translate-y-1">
                        <UserPlus size={18} /> Register as Donor
                    </button>
                </div>
            </div>

            {/* Smart Filters Bar */}
            <div className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 mb-10 flex flex-col md:flex-row items-center gap-4 relative z-20">
                <div className="relative w-full md:w-1/3">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search size={18} className="text-slate-400" />
                    </div>
                    <input type="text" placeholder="Search by location..." value={filters.search} onChange={(e) => setFilters({...filters, search: e.target.value})} className="w-full bg-slate-50 border-none pl-11 py-3.5 rounded-xl font-medium outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-700 transition-all" />
                </div>
                
                <div className="relative w-full md:w-1/3">
                    <select value={filters.type} onChange={(e) => setFilters({...filters, type: e.target.value})} className="w-full bg-slate-50 border-none px-4 py-3.5 rounded-xl font-medium outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-700 appearance-none cursor-pointer transition-all">
                        <option value="All">All Blood Groups</option>
                        {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(v => <option key={v} value={v}>Type {v}</option>)}
                    </select>
                </div>
                
                <div className="relative w-full md:w-1/3">
                    <select value={filters.status} onChange={(e) => setFilters({...filters, status: e.target.value})} className="w-full bg-slate-50 border-none px-4 py-3.5 rounded-xl font-medium outline-none focus:ring-2 focus:ring-rose-500/20 text-slate-700 appearance-none cursor-pointer transition-all">
                        <option value="All">Everyone</option>
                        <option value="Available Donors">Available Now</option>
                    </select>
                </div>
            </div>

            {/* Content Display */}
            {isLoading ? (
                <div className="flex flex-col justify-center items-center py-32 opacity-50">
                    <Loader2 size={40} className="text-rose-500 animate-spin mb-4" />
                    <p className="text-slate-600 font-medium tracking-wide">Loading donor network...</p>
                </div>
            ) : filteredDonors.length === 0 ? (
                <div className="bg-white/50 border border-dashed border-slate-300 rounded-3xl py-32 flex flex-col items-center">
                    <div className="bg-slate-100 p-6 rounded-full mb-6">
                        <Droplet size={48} className="text-slate-400" />
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-2">No Matching Donors</h3>
                    <p className="text-slate-500 font-medium">Try broadening your search criteria or register as a donor yourself!</p>
                    <button onClick={() => setFilters({ search: "", type: "All", status: "All" })} className="mt-6 text-rose-600 font-bold hover:underline">Clear Filters</button>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                    {filteredDonors.map(d => {
                        const { isEligible, lastDateFmt, nextEligible } = checkEligibility(d.lastDonationDate);
                        
                        return (
                            <div key={d._id} className="group bg-white rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.08)] border border-slate-100 flex flex-col transition-all duration-500 transform hover:-translate-y-2 relative overflow-hidden">
                                
                                {/* Photo Header Area */}
                                <div className="h-56 w-full relative overflow-hidden bg-slate-100">
                                    {(user?.role === 'admin' || d.userId === user?._id) && (
                                        <div className="absolute top-4 right-4 flex flex-col gap-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity">
                                            {d.userId === user?._id && (
                                            <button onClick={() => setEditModal({ show: true, donor: d })} className="bg-white p-2 rounded-full shadow-md text-sky-500 hover:bg-sky-50 hover:scale-110 transition-transform">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                            </button>
                                            )}
                                            <button onClick={() => handleDelete(d._id)} className="bg-white text-rose-500 p-2 rounded-full shadow-md hover:bg-rose-50 hover:scale-110 transition-transform">
                                                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/></svg>
                                            </button>
                                        </div>
                                    )}
                                    <img src={d.photo || DEFAULT_PHOTO} alt={d.donorName} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                                    
                                    {/* Blood Bag Badge */}
                                    <div className={`absolute top-4 left-4 z-10 px-4 py-2 rounded-xl backdrop-blur-md bg-gradient-to-br ${typeColors[d.bloodType] || "from-slate-600 to-slate-800"} text-white font-black shadow-lg flex items-center gap-1.5 ring-2 ring-white/20`}>
                                        {d.bloodType}
                                    </div>

                                    {/* Eligibility Overlay Pill */}
                                    <div className="absolute bottom-4 right-4 z-10">
                                         <div className={`absolute inset-0 blur-md ${isEligible && d.available !== false ? 'bg-emerald-500' : 'bg-slate-600'} opacity-40 rounded-full`}></div>
                                         <div className={`relative px-4 py-1.5 rounded-full text-xs font-bold shadow-md bg-white border ${isEligible && d.available !== false ? 'text-emerald-600 border-emerald-100' : 'text-slate-500 border-slate-200'}`}>
                                             {isEligible && d.available !== false ? 'Available' : 'Resting'}
                                         </div>
                                    </div>
                                    
                                    {/* Vignette Overlay */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80"></div>
                                    
                                    <h4 className="absolute bottom-4 left-4 text-2xl font-black text-white tracking-tight drop-shadow-md">{d.donorName}</h4>
                                </div>
                                
                                {/* Details Body */}
                                <div className="p-6 flex flex-col flex-grow relative bg-white">
                                    <div className="space-y-3 mb-6">
                                        <div className="flex items-center gap-3 text-slate-600 font-medium group/item hover:text-slate-800 transition-colors">
                                            <div className="p-2 bg-slate-50 rounded-lg group-hover/item:bg-slate-100 transition-colors">
                                                <Phone size={16} className="text-slate-500" />
                                            </div>
                                            {d.phone}
                                        </div>
                                        <div className="flex items-center gap-3 text-slate-600 font-medium group/item hover:text-slate-800 transition-colors">
                                            <div className="p-2 bg-rose-50 rounded-lg group-hover/item:bg-rose-100 transition-colors">
                                                <MapPin size={16} className="text-rose-500" />
                                            </div>
                                            <span className="line-clamp-1">{d.location}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Date Timeline */}
                                    <div className="w-full bg-slate-50 rounded-2xl p-4 flex justify-between items-center mt-auto mb-6 border border-slate-100">
                                        <div className="flex items-start gap-3">
                                            <Calendar size={18} className="text-slate-400 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Last Donation</span>
                                                <span className="text-sm font-bold text-slate-800">{lastDateFmt}</span>
                                            </div>
                                        </div>
                                        <div className="h-8 w-px bg-slate-200"></div>
                                        <div className="flex flex-col text-right">
                                            <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 mb-0.5">Next Eligible</span>
                                            <span className={`text-sm font-bold ${isEligible ? 'text-emerald-500' : 'text-slate-800'}`}>{nextEligible}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Action Button */}
                                    {isEligible ? (
                                        <a href={`tel:${d.phone}`} className="w-full py-4 bg-slate-900 hover:bg-rose-600 text-white font-bold rounded-xl transition-all duration-300 text-sm text-center shadow-lg shadow-slate-900/10 hover:shadow-rose-600/30 flex justify-center items-center gap-2">
                                            Request Blood <ArrowRight size={16} className="opacity-70 group-hover:translate-x-1 transition-transform" />
                                        </a>
                                    ) : (
                                        <button disabled className="w-full py-4 bg-slate-100 text-slate-400 font-bold rounded-xl cursor-not-allowed text-sm text-center border border-slate-200">
                                            Currently Ineligible
                                        </button>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Edit Modal */}
            {editModal.show && editModal.donor && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditModal({ show: false, donor: null })}></div>
                    <div className="relative bg-white rounded-[2.5rem] p-8 max-w-lg w-full shadow-2xl overflow-y-auto max-h-[90vh]">
                        <button onClick={() => setEditModal({ show: false, donor: null })} className="absolute top-6 right-6 text-slate-400 hover:bg-slate-100 p-1.5 rounded-full"><X size={20}/></button>
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-6 flex items-center gap-2">Edit Donor Profile</h3>
                        
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Image Update (Auto Base64)</label>
                                <label className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 text-sm overflow-hidden text-slate-500">
                                    <ImagePlus size={18} className="text-rose-500 flex-shrink-0" />
                                    <span className="truncate">Change Image</span>
                                    <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
                                </label>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Full Name</label>
                                <input value={editModal.donor.donorName} onChange={(e) => setEditModal({...editModal, donor: {...editModal.donor, donorName: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Blood Type</label>
                                    <select value={editModal.donor.bloodType} onChange={(e) => setEditModal({...editModal, donor: {...editModal.donor, bloodType: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none appearance-none" required>
                                        {["A+", "A-", "B+", "B-", "O+", "O-", "AB+", "AB-"].map(v => <option key={v} value={v}>{v}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Phone Number</label>
                                    <input value={editModal.donor.phone} onChange={(e) => setEditModal({...editModal, donor: {...editModal.donor, phone: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Last Donation Date</label>
                                <input type="date" value={editModal.donor.lastDonationDate ? new Date(editModal.donor.lastDonationDate).toISOString().split('T')[0] : ''} onChange={(e) => setEditModal({...editModal, donor: {...editModal.donor, lastDonationDate: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none" required />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Availability Status</label>
                                    <select value={editModal.donor.available !== false ? "true" : "false"} onChange={(e) => setEditModal({...editModal, donor: {...editModal.donor, available: e.target.value === "true"}})} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none appearance-none" required>
                                        <option value="true">Available to Donate</option>
                                        <option value="false">Currently Unavailable</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Location / City</label>
                                    <input value={editModal.donor.location} onChange={(e) => setEditModal({...editModal, donor: {...editModal.donor, location: e.target.value}})} className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl outline-none" required />
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setEditModal({ show: false, donor: null })} className="flex-1 btn bg-slate-100 text-slate-600 font-bold py-3 hover:bg-slate-200 rounded-xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary bg-rose-600 hover:bg-rose-700 py-3 rounded-xl transition-all h-auto">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
