import { useEffect, useState, useCallback, useMemo } from "react";
import { getAdminOverview, adminDeleteUser, adminDeleteItem, adminVerifyBloodDonor } from "../../api";
import {
    ShieldAlert, Users, Calendar, Pill, Droplet, Trash2,
    LayoutDashboard, CheckCircle, Search, Bell, Settings,
    LogOut, MoreVertical, Star, ChevronLeft, ChevronRight,
    TrendingUp, ExternalLink, X, AlertCircle, Info, Check
} from "lucide-react";
import {
    BarChart, Bar, XAxis, YAxis, CartesianGrid,
    Tooltip, ResponsiveContainer
} from 'recharts';

export default function AdminDashboard() {
    const user = JSON.parse(localStorage.getItem("user"));
    const [data, setData] = useState(null);
    const [activeTab, setActiveTab] = useState("Dashboard");
    const [isLoading, setIsLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    // UI State for Modal & Toast
    const [toast, setToast] = useState(null);
    const [modal, setModal] = useState({ show: false, type: '', id: '', message: '' });

    // Show persistent toast that fades out
    const showToast = (msg, type = "success") => {
        setToast({ msg, type });
        setTimeout(() => setToast(null), 4000);
    };

    const load = useCallback(async (showSpinner = true) => {
        if (showSpinner) setIsLoading(true);
        try {
            const res = await getAdminOverview(user.token);
            setData(res.data);
        } catch (e) {
            showToast("Failed to sync records. Check connection.", "error");
        } finally {
            if (showSpinner) setIsLoading(false);
        }
    }, [user.token]);

    const handleAction = async () => {
        const { type, id, coll } = modal;
        setModal({ ...modal, show: false });

        try {
            if (type === 'deleteUser') {
                await adminDeleteUser(user.token, id);
                showToast("User successfully removed");
            } else if (type === 'deleteItem') {
                await adminDeleteItem(user.token, coll, id);
                showToast(`${coll} record deleted`);
            } else if (type === 'verify') {
                await adminVerifyBloodDonor(user.token, id);
                showToast("Donor verified successfully");
            }
            load(false);
        } catch (err) {
            showToast(err.response?.data?.message || "Operation failed", "error");
        }
    };

    useEffect(() => { load(); }, [load]);

    const filteredUsers = useMemo(() =>
        data?.users?.filter(u => u.name.toLowerCase().includes(searchTerm.toLowerCase()) || u.email.toLowerCase().includes(searchTerm.toLowerCase())) || [],
        [data?.users, searchTerm]);

    const filteredDonors = useMemo(() =>
        data?.donors?.filter(d => d.donorName.toLowerCase().includes(searchTerm.toLowerCase()) || d.bloodType.toLowerCase().includes(searchTerm.toLowerCase())) || [],
        [data?.donors, searchTerm]);

    const filteredAppointments = useMemo(() =>
        data?.appointments?.filter(a => a.doctorName.toLowerCase().includes(searchTerm.toLowerCase())) || [],
        [data?.appointments, searchTerm]);

    const filteredMedicines = useMemo(() =>
        data?.medicines?.filter(m => m.name.toLowerCase().includes(searchTerm.toLowerCase())) || [],
        [data?.medicines, searchTerm]);

    if (!user || user.role !== "admin") {
        return (
            <div className="flex flex-col items-center justify-center min-h-[60vh]">
                <ShieldAlert size={64} className="text-red-500 mb-4" />
                <h3 className="text-2xl font-bold text-slate-800">Access Denied</h3>
                <p className="text-slate-500">Administrator privileges required.</p>
            </div>
        );
    }

    if (isLoading || !data) return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-500 mb-4"></div>
            <p className="text-slate-500 font-medium tracking-tight">Synchronizing Global Health Data...</p>
        </div>
    );
    const Toast = () => (
        <div className={`fixed top-6 right-6 z-[100] flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border transition-all animate-in slide-in-from-right-10 duration-300 ${toast.type === "success" ? "bg-sky-50 border-sky-100 text-sky-800" : "bg-rose-50 border-rose-100 text-rose-800"
            }`}>
            {toast.type === "success" ? <Check size={18} /> : <AlertCircle size={18} />}
            <span className="font-bold text-sm tracking-tight">{toast.msg}</span>
            <button onClick={() => setToast(null)} className="ml-2 hover:opacity-70"><X size={14} /></button>
        </div>
    );

    const ConfirmModal = () => (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white rounded-[2.5rem] p-8 max-w-sm w-full shadow-2xl border border-slate-100 space-y-6">
                <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center">
                    <AlertCircle size={32} />
                </div>
                <div>
                    <h3 className="text-xl font-black text-slate-800 mb-2 tracking-tight">Are you sure?</h3>
                    <p className="text-slate-500 text-sm font-medium leading-relaxed">{modal.message}</p>
                </div>
                <div className="flex gap-3 pt-2">
                    <button onClick={() => setModal({ ...modal, show: false })} className="flex-1 py-3.5 rounded-2xl bg-slate-50 text-slate-500 font-bold hover:bg-slate-100 transition-all text-sm">Cancel</button>
                    <button onClick={handleAction} className="flex-1 py-3.5 rounded-2xl bg-rose-500 text-white font-bold hover:bg-rose-600 shadow-lg shadow-rose-200 transition-all text-sm">Confirm</button>
                </div>
            </div>
        </div>
    );

    const TableHeader = ({ cols }) => (
        <thead>
            <tr className="bg-slate-50/50">
                <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">#</th>
                {cols.map(c => (
                    <th key={c} className="px-4 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">{c}</th>
                ))}
                <th className="px-8 py-5 text-right text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50">Actions</th>
            </tr>
        </thead>
    );

    const chartData = [
        { name: 'Jan', patient: 2400, inpatient: 1200 },
        { name: 'Feb', patient: 3000, inpatient: 1500 },
        { name: 'Mar', patient: 1800, inpatient: 900 },
        { name: 'Apr', patient: 2780, inpatient: 1800 },
        { name: 'May', patient: 1890, inpatient: 1200 },
        { name: 'Jun', patient: 2390, inpatient: 1500 },
        { name: 'Jul', patient: 4490, inpatient: 2800 },
        { name: 'Aug', patient: 3490, inpatient: 2100 },
        { name: 'Sep', patient: 2890, inpatient: 1600 },
        { name: 'Oct', patient: 3990, inpatient: 2300 },
        { name: 'Nov', patient: 4290, inpatient: 2400 },
        { name: 'Dec', patient: 3290, inpatient: 1800 },
    ];

    const StatCard = ({ title, value, icon: Icon, bgClass, textClass, subText }) => (
        <div className={`${bgClass} p-6 rounded-3xl transition-all hover:scale-[1.02] cursor-default border border-white/40 shadow-sm`}>
            <div className="flex justify-between items-start mb-4">
                <div className={`p-3 rounded-2xl bg-white shadow-sm ${textClass}`}>
                    <Icon size={24} />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
                    <TrendingUp size={12} /> {subText || "+20% ↑"}
                </div>
            </div>
            <div>
                <p className="text-sm font-semibold text-slate-600 mb-1">{title}</p>
                <h4 className="text-3xl font-black text-slate-800 tracking-tight">{value}</h4>
            </div>
        </div>
    );

    const SidebarItem = ({ icon: Icon, label }) => (
        <button
            onClick={() => setActiveTab(label)}
            className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl transition-all font-bold ${activeTab === label
                ? "bg-sky-600 text-white shadow-lg shadow-sky-200"
                : "text-slate-400 hover:text-sky-600 hover:bg-sky-50"
                }`}
        >
            <Icon size={20} />
            <span className="text-sm">{label}</span>
        </button>
    );

    // Calendar Logic
    const today = new Date();
    const currentDay = today.getDate();
    const daysInMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
    const firstDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 1).getDay();
    const monthName = today.toLocaleString('default', { month: 'long' });

    return (
        <div className="relative min-h-screen bg-[#F8FAFC]/50 p-4 lg:p-8">
            {toast && <Toast />}
            {modal.show && <ConfirmModal />}

            <div className="flex flex-col lg:flex-row gap-8 max-w-[1600px] mx-auto animate-in fade-in duration-700">

                {/* Sidebar Navigation */}
                <aside className="w-full lg:w-72 flex flex-col gap-8 shrink-0">
                    <div className="bg-white rounded-[2.5rem] p-4 shadow-sm border border-slate-100 min-h-[700px] flex flex-col sticky top-8">
                        <div className="px-6 py-8 flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-sky-100 font-black">H</div>
                            <span className="text-lg font-black text-slate-800 tracking-tight">HealthSync</span>
                        </div>

                        <div className="flex flex-col gap-2 flex-grow mt-4">
                            <SidebarItem icon={LayoutDashboard} label="Dashboard" />
                            <SidebarItem icon={Users} label="Users" />
                            <SidebarItem icon={Calendar} label="Appointments" />
                            <SidebarItem icon={Pill} label="Pharmacy" />
                            <SidebarItem icon={Droplet} label="Blood Bank" />
                        </div>

                        <div className="pt-6 border-t border-slate-50 space-y-2 mb-4">

                            <button onClick={() => { localStorage.removeItem("user"); window.location.reload(); }} className="w-full flex items-center gap-4 px-6 py-3 text-rose-500 hover:text-rose-600 font-bold transition-all text-sm">
                                <LogOut size={20} /> Log Out
                            </button>
                        </div>
                    </div>
                </aside>

                {/* Content Area */}
                <main className="flex-grow flex flex-col gap-10 min-w-0">

                    {/* Header View */}
                    <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                        <div className="relative w-full md:w-[450px] group">
                            {activeTab !== "Dashboard" && (
                                <>
                                    <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-sky-500 transition-colors" size={18} />
                                    <input
                                        type="text"
                                        value={searchTerm}
                                        onChange={(e) => setSearchTerm(e.target.value)}
                                        placeholder={`Search in ${activeTab}...`}
                                        className="w-full pl-14 pr-6 py-4 rounded-3xl bg-white border border-slate-100 shadow-sm outline-none focus:ring-4 focus:ring-sky-500/5 focus:border-sky-500/20 transition-all font-medium text-slate-600"
                                    />
                                </>
                            )}
                        </div>
                        <div className="flex items-center gap-4 bg-white p-2 rounded-[2rem] shadow-sm border border-slate-50">
                            <button className="p-3.5 rounded-2xl text-slate-400 hover:text-sky-600 hover:bg-sky-50 transition-all relative">
                                <Bell size={20} />
                                <span className="absolute top-3.5 right-3.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
                            </button>
                            <div className="flex items-center gap-3 pl-4 pr-2 border-l border-slate-100">
                                <div className="text-right">
                                    <p className="text-xs font-black text-slate-800 leading-tight">{user.name}</p>
                                    <p className="text-[10px] font-bold text-sky-600 uppercase tracking-widest">Master Admin</p>
                                </div>
                                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 flex items-center justify-center text-white font-black text-sm shadow-md uppercase">
                                    {user.name.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </div>

                    {activeTab === "Dashboard" && (
                        <div className="grid grid-cols-1 xl:grid-cols-3 gap-10">
                            <div className="xl:col-span-2 space-y-12">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-8">Performance Metrics</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <StatCard title="Active Users" value={data.stats.totalUsers} icon={Users} bgClass="bg-[#EAF2FF]" textClass="text-[#2F80ED]" subText="+12% vs last month" />
                                        <StatCard title="Appointments" value={data.stats.appointments} icon={Calendar} bgClass="bg-[#FFF4E8]" textClass="text-[#FF8A00]" subText="92% completion rate" />
                                        <StatCard title="Revenue" value="৳24.5k" icon={TrendingUp} bgClass="bg-[#EAF2FF]" textClass="text-[#2F80ED]" subText="Target: $30k" />
                                    </div>
                                </div>

                                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-10">
                                        <div>
                                            <h3 className="text-xl font-black text-slate-800 tracking-tight">Patient Statistics</h3>
                                            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">Yearly Activity Analysis</p>
                                        </div>
                                        <div className="flex bg-slate-50 p-1.5 rounded-2xl gap-1">
                                            {['Weekly', 'Monthly'].map(t => (
                                                <button key={t} className={`px-5 py-2 rounded-xl text-xs font-black transition-all ${t === 'Monthly' ? 'bg-white text-sky-600 shadow-sm border border-slate-100' : 'text-slate-400 hover:text-slate-600'}`}>
                                                    {t}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                    <div className="h-[350px] w-full">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={chartData} margin={{ top: 0, right: 0, left: -20, bottom: 0 }}>
                                                <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }} dy={10} />
                                                <YAxis axisLine={false} tickLine={false} tick={{ fill: '#94A3B8', fontSize: 10, fontWeight: 800 }} />
                                                <Tooltip cursor={{ fill: '#F8FAFC' }} contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 25px 50px -12px rgb(0 0 0 / 0.1)' }} />
                                                <Bar dataKey="patient" fill="#0EA5E9" radius={[8, 8, 0, 0]} barSize={14} />
                                                <Bar dataKey="inpatient" fill="#FBBF24" radius={[8, 8, 0, 0]} barSize={14} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>

                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-6">Recent Activity</h3>
                                    <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden overflow-x-auto">
                                        <table className="w-full text-left">
                                            <TableHeader cols={["Record Name", "Type", "Status"]} />
                                            <tbody className="divide-y divide-slate-50">
                                                {data.appointments.slice(0, 5).map((a, i) => (
                                                    <tr key={`dash-appt-${a._id}`} className="hover:bg-slate-50 transition-colors group">
                                                        <td className="px-8 py-5 text-sm font-bold text-slate-400">{i + 1}</td>
                                                        <td className="px-4 py-5">
                                                            <div className="font-bold text-slate-800">{a.patientName}</div>
                                                            <div className="text-[10px] font-bold text-slate-400 flex items-center gap-1 group-hover:text-emerald-600 transition-colors">
                                                                <Calendar size={10} /> Appointment
                                                            </div>
                                                        </td>
                                                        <td className="px-4 py-5 text-sm font-bold text-slate-500">Dr. {a.doctorName}</td>
                                                        <td className="px-4 py-5">
                                                            <span className="px-3 py-1 rounded-lg bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-wider">Pending</span>
                                                        </td>
                                                        <td className="px-8 py-5 text-right">
                                                            <button onClick={() => setModal({ show: true, type: 'deleteItem', coll: 'appointment', id: a._id, message: `Delete appointment for ${a.patientName}?` })} className="p-2.5 rounded-xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                                                                <Trash2 size={16} />
                                                            </button>
                                                        </td>
                                                    </tr>
                                                ))}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col gap-10">
                                <div className="bg-white rounded-[3rem] p-10 border border-slate-100 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <h3 className="text-lg font-black text-slate-800 tracking-tight">Health Calendar <span className="text-sm text-slate-400 font-bold ml-2">{monthName} {today.getFullYear()}</span></h3>
                                        <ChevronRight size={18} className="text-slate-300" />
                                    </div>
                                    <div className="grid grid-cols-7 gap-y-6 text-center">
                                        {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, index) => (
                                            <span key={`day-${index}`} className="text-[10px] font-black text-slate-300 uppercase">{d}</span>
                                        ))}
                                        {[...Array(firstDayOfMonth)].map((_, i) => (
                                            <div key={`empty-${i}`} className="py-2.5"></div>
                                        ))}
                                        {[...Array(daysInMonth)].map((_, i) => (
                                            <div key={`date-${i}`} className={`text-xs font-black py-2.5 rounded-2xl transition-all cursor-pointer flex items-center justify-center ${i + 1 === currentDay ? 'bg-sky-600 text-white shadow-xl shadow-sky-100 scale-110' : 'text-slate-500 hover:bg-slate-50'}`}>
                                                {i + 1}
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div className="bg-[#1E293B] rounded-[3rem] p-10 text-white shadow-2xl relative overflow-hidden group">
                                    <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-500/10 rounded-full -translate-y-1/2 translate-x-1/2 blur-2xl group-hover:bg-emerald-500/20 transition-all duration-700"></div>
                                    <h3 className="text-lg font-black tracking-tight mb-8 relative z-10">Staff Excellence</h3>
                                    <div className="space-y-8 relative z-10">
                                        {[
                                            { name: "Sarah Connor", role: "Sr. Nurse", rating: 5.0 },
                                            { name: "Marcus Wright", role: "Oncologist", rating: 4.8 }
                                        ].map((staff, i) => (
                                            <div key={i} className="flex items-center justify-between">
                                                <div className="flex items-center gap-4">
                                                    <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center font-black text-xs">{staff.name.charAt(0)}</div>
                                                    <div>
                                                        <p className="text-sm font-black">{staff.name}</p>
                                                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{staff.role}</p>
                                                    </div>
                                                </div>
                                                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10">
                                                    <Star size={12} className="text-yellow-400 fill-yellow-400" />
                                                    <span className="text-xs font-black">{staff.rating}</span>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab !== "Dashboard" && (
                        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden animate-in zoom-in-95 duration-500">
                            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/20">
                                <div>
                                    <h3 className="text-2xl font-black text-slate-800 tracking-tight mb-1 flex items-center gap-3">
                                        Manage {activeTab}
                                    </h3>
                                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Administrative Control Panel</p>
                                </div>
                                <button className="bg-white border border-slate-100 p-3 rounded-2xl text-slate-400 hover:text-sky-600 hover:shadow-sm transition-all shadow-sm">
                                    <MoreVertical size={20} />
                                </button>
                            </div>

                            <div className="overflow-x-auto">
                                {activeTab === "Users" && (
                                    <table className="w-full text-left">
                                        <TableHeader cols={["Full Name", "System Role", "Contact"]} />
                                        <tbody className="divide-y divide-slate-50">
                                            {filteredUsers.map((u, i) => (
                                                <tr key={`user-${u._id}`} className="hover:bg-slate-50/80 transition-colors group">
                                                    <td className="px-8 py-5 text-sm font-bold text-slate-400">{i + 1}</td>
                                                    <td className="px-4 py-5 font-bold text-slate-800">{u.name}</td>
                                                    <td className="px-4 py-5">
                                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${u.role === 'admin' ? 'bg-purple-50 text-purple-600' :
                                                            u.role === 'doctor' ? 'bg-blue-50 text-blue-600' : 'bg-slate-50 text-slate-600'
                                                            }`}>
                                                            {u.role}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-5 text-sm font-bold text-slate-500">{u.email}</td>
                                                    <td className="px-8 py-5 text-right">
                                                        {u.role !== "admin" && (
                                                            <button onClick={() => setModal({ show: true, type: 'deleteUser', id: u._id, message: `Permanently remove ${u.name} from the system?` })} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        )}
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {activeTab === "Appointments" && (
                                    <table className="w-full text-left">
                                        <TableHeader cols={["Patient", "Doctor Assigned", "Status"]} />
                                        <tbody className="divide-y divide-slate-50">
                                            {filteredAppointments.map((a, i) => (
                                                <tr key={`appt-${a._id}`} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-8 py-5 text-sm font-bold text-slate-400">{i + 1}</td>
                                                    <td className="px-4 py-5 font-bold text-slate-800">{a.patientName}</td>
                                                    <td className="px-4 py-5 font-bold text-slate-600">{a.doctorName}</td>
                                                    <td className="px-4 py-5">
                                                        <span className="px-4 py-1.5 rounded-xl bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-wider">Active</span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <button onClick={() => setModal({ show: true, type: 'deleteItem', coll: 'appointment', id: a._id, message: `Delete appointment for ${a.patientName}?` })} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {activeTab === "Pharmacy" && (
                                    <table className="w-full text-left">
                                        <TableHeader cols={["Medicine Name", "Current Stock", "Status"]} />
                                        <tbody className="divide-y divide-slate-50">
                                            {filteredMedicines.map((m, i) => (
                                                <tr key={`medicine-${m._id}`} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-8 py-5 text-sm font-bold text-slate-400">{i + 1}</td>
                                                    <td className="px-4 py-5 font-bold text-slate-800">{m.name}</td>
                                                    <td className="px-4 py-5 font-bold text-slate-600">{m.quantity} Units</td>
                                                    <td className="px-4 py-5">
                                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${m.quantity < 10 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                                                            }`}>
                                                            {m.quantity < 10 ? 'Low Stock' : 'In Stock'}
                                                        </span>
                                                    </td>
                                                    <td className="px-8 py-5 text-right">
                                                        <button onClick={() => setModal({ show: true, type: 'deleteItem', coll: 'medicine', id: m._id, message: `Remove ${m.name} from inventory?` })} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                                                            <Trash2 size={18} />
                                                        </button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}

                                {activeTab === "Blood Bank" && (
                                    <table className="w-full text-left">
                                        <TableHeader cols={["Donor Profile", "Verification", "Blood Type"]} />
                                        <tbody className="divide-y divide-slate-50">
                                            {filteredDonors.map((d, i) => (
                                                <tr key={`donor-${d._id}`} className="hover:bg-slate-50 transition-colors group">
                                                    <td className="px-8 py-5 text-sm font-bold text-slate-400">{i + 1}</td>
                                                    <td className="px-4 py-5">
                                                        <div className="font-bold text-slate-800">{d.donorName}</div>
                                                        <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{d.location}</div>
                                                    </td>
                                                    <td className="px-4 py-5">
                                                        <span className={`px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-wider ${d.isVerified ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600 shadow-sm shadow-amber-100'
                                                            }`}>
                                                            {d.isVerified ? 'Verified' : 'Pending Review'}
                                                        </span>
                                                    </td>
                                                    <td className="px-4 py-5 font-black text-rose-600 text-sm">{d.bloodType}</td>
                                                    <td className="px-8 py-5 text-right">
                                                        <div className="flex justify-end gap-2">
                                                            {!d.isVerified && (
                                                                <button onClick={() => setModal({ show: true, type: 'verify', id: d._id, message: `Approve ${d.donorName} as an active donor?` })} className="p-3 rounded-2xl bg-sky-50 text-sky-600 hover:bg-sky-100 transition-all" title="Verify Donor">
                                                                    <CheckCircle size={18} />
                                                                </button>
                                                            )}
                                                            <button onClick={() => setModal({ show: true, type: 'deleteItem', coll: 'blood', id: d._id, message: `Remove ${d.donorName} from donor bank?` })} className="p-3 rounded-2xl bg-slate-50 text-slate-400 hover:bg-rose-50 hover:text-rose-500 transition-all">
                                                                <Trash2 size={18} />
                                                            </button>
                                                        </div>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                )}
                            </div>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
