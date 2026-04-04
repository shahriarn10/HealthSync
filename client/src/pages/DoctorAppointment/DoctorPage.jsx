import { useEffect, useState } from "react";
import { getDoctorData, addDoctorData, deleteAppointment } from "../../api";

import { Calendar, Clock, User, UserPlus, Trash2, CalendarDays, Stethoscope } from "lucide-react";

export default function DoctorPage() {
    const [appointments, setAppointments] = useState([]);
    const [form, setForm] = useState({ doctorName: "", patientName: "", date: "", time: "" });
    const user = JSON.parse(localStorage.getItem("user"));

    const load = async () => {
        const res = await getDoctorData(user.token);
        setAppointments(res.data);
    };

    useEffect(() => { load(); }, []);

    const handleAdd = async (e) => {
        e.preventDefault();
        await addDoctorData(user.token, form);
        setForm({ doctorName: "", patientName: "", date: "", time: "" });
        load();
    };

    const handleDelete = async (id) => {
        await deleteAppointment(user.token, id);
        load();
    };

    return (
        <div className="max-w-6xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center gap-3 mb-8">
                <div className="p-3 bg-sky-100 text-sky-600 rounded-xl">
                    <CalendarDays size={28} />
                </div>
                <div>
                    <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Appointments</h2>
                    <p className="text-slate-500">Manage doctor-patient schedules</p>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Form Section */}
                <div className="lg:col-span-1">
                    <div className="glass-card p-6 sticky top-24">
                        <h3 className="text-lg font-semibold text-slate-800 mb-4 flex items-center gap-2">
                            <UserPlus size={20} className="text-sky-500" />
                            Book Appointment
                        </h3>
                        <form onSubmit={handleAdd} className="space-y-4">
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Doctor Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Stethoscope size={16} className="text-slate-400" />
                                    </div>
                                    <input name="doctorName" placeholder="Dr. Smith" value={form.doctorName}
                                        onChange={(e) => setForm({ ...form, doctorName: e.target.value })} 
                                        className="input-field pl-10" required />
                                </div>
                            </div>
                            <div>
                                <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Patient Name</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <User size={16} className="text-slate-400" />
                                    </div>
                                    <input name="patientName" placeholder="John Doe" value={form.patientName}
                                        onChange={(e) => setForm({ ...form, patientName: e.target.value })} 
                                        className="input-field pl-10" required />
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Date</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Calendar size={16} className="text-slate-400" />
                                        </div>
                                        <input type="date" name="date" value={form.date}
                                            onChange={(e) => setForm({ ...form, date: e.target.value })} 
                                            className="input-field pl-10 px-2" required />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-medium text-slate-500 mb-1 uppercase tracking-wider">Time</label>
                                    <div className="relative">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Clock size={16} className="text-slate-400" />
                                        </div>
                                        <input type="time" name="time" value={form.time}
                                            onChange={(e) => setForm({ ...form, time: e.target.value })} 
                                            className="input-field pl-10 px-2" required />
                                    </div>
                                </div>
                            </div>
                            <button type="submit" className="w-full btn-primary mt-2">
                                Schedule
                            </button>
                        </form>
                    </div>
                </div>

                {/* List Section */}
                <div className="lg:col-span-2 space-y-4">
                    {appointments.length === 0 ? (
                        <div className="glass-card p-12 text-center flex flex-col items-center justify-center border-dashed border-2 border-slate-200">
                            <CalendarDays size={48} className="text-slate-300 mb-4" />
                            <h3 className="text-lg font-medium text-slate-600">No appointments scheduled</h3>
                            <p className="text-slate-500 text-sm mt-1">Use the form to book a new appointment.</p>
                        </div>
                    ) : (
                        appointments.map(a => (
                            <div key={a._id} className="glass-card p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 group hover:border-sky-200 transition-colors">
                                <div className="flex items-start gap-4">
                                    <div className="hidden sm:flex h-12 w-12 rounded-full bg-indigo-50 text-indigo-600 items-center justify-center flex-shrink-0">
                                        <User size={24} />
                                    </div>
                                    <div>
                                        <h4 className="text-lg font-semibold text-slate-800">{a.patientName}</h4>
                                        <p className="text-slate-500 flex items-center gap-1.5 text-sm mt-1">
                                            <Stethoscope size={14} /> {a.doctorName}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto mt-2 sm:mt-0 border-t sm:border-t-0 pt-3 sm:pt-0 border-slate-100">
                                    <div className="flex flex-col sm:items-end text-sm text-slate-600">
                                        <div className="flex items-center gap-1.5 font-medium text-slate-700">
                                            <Calendar size={14} className="text-sky-500" /> {a.date}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            <Clock size={14} className="text-amber-500" /> {a.time}
                                        </div>
                                    </div>
                                    <button onClick={() => handleDelete(a._id)} className="btn-danger p-2 h-auto rounded-full" aria-label="Cancel appointment">
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
