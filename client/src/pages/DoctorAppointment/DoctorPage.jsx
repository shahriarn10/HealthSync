import { useEffect, useState } from "react";
import { getDoctorProfiles, createDoctorProfile, deleteDoctorProfile, getAppointments, createAppointment, updateAppointmentStatus, deleteAppointment } from "../../api";
import { Calendar, Clock, User, UserPlus, Trash2, CalendarDays, Stethoscope, ImagePlus, ShieldCheck, CheckCircle, X, ChevronRight } from "lucide-react";

export default function DoctorPage() {
    // Shared States
    const user = JSON.parse(localStorage.getItem("user"));
    const isAdminOrDoc = user?.role === "admin" || user?.role === "doctor";
    const [activeTab, setActiveTab] = useState(isAdminOrDoc ? "profiles" : "directory");
    
    // Data States
    const [doctors, setDoctors] = useState([]);
    const [appointments, setAppointments] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [editModal, setEditModal] = useState({ show: false, doc: null });
    
    // Admin/Doc Forms
    const [docForm, setDocForm] = useState({ name: "", specialization: "", image: "", availableTimes: [] });
    // Using a static set of standard shift times for simplicity
    const shiftTimes = ["09:00 AM", "10:00 AM", "11:00 AM", "01:00 PM", "02:00 PM", "03:00 PM", "04:00 PM"];

    // Patient Booking Booking Form state
    const [isBookingModalOpen, setIsBookingModalOpen] = useState(false);
    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [bookingForm, setBookingForm] = useState({ date: "", time: "", patientName: user?.name || "" });

    const loadData = async () => {
        try {
            const docRes = await getDoctorProfiles(user.token);
            setDoctors(docRes.data);
            const apptRes = await getAppointments(user.token);
            setAppointments(apptRes.data);
        } catch (e) {
            console.error(e);
        }
    };

    useEffect(() => { loadData(); }, []);

    // -------------- Admin/Doc specific methods --------------
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setDocForm({ ...docForm, image: reader.result });
            reader.readAsDataURL(file);
        }
    };

    const toggleTimeSelect = (time) => {
        const times = docForm.availableTimes.includes(time)
            ? docForm.availableTimes.filter(t => t !== time)
            : [...docForm.availableTimes, time];
        setDocForm({ ...docForm, availableTimes: times });
    };

    const handleAddDoctor = async (e) => {
        e.preventDefault();
        if(docForm.availableTimes.length === 0) return alert("Please select at least one available appointment time slot.");
        try {
            await createDoctorProfile(user.token, docForm);
            setDocForm({ name: "", specialization: "", image: "", availableTimes: [] });
            loadData();
        } catch (e) { alert("Failed to add doctor profile") }
    };

    const handleDeleteDoctor = async (id) => {
        try {
            await deleteDoctorProfile(user.token, id);
            loadData();
        } catch (e) { alert("Failed to remove doctor") }
    };

    const handleStatusUpdate = async (id, status) => {
        try {
            await updateAppointmentStatus(user.token, id, status);
            loadData();
        } catch (e) { alert("Failed to update status") }
    };

    // -------------- Edit Logic --------------
    const handleEditImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setEditModal({ ...editModal, doc: { ...editModal.doc, image: reader.result } });
            reader.readAsDataURL(file);
        }
    };

    const toggleEditTimeSelect = (time) => {
        const times = editModal.doc.availableTimes.includes(time)
            ? editModal.doc.availableTimes.filter(t => t !== time)
            : [...editModal.doc.availableTimes, time];
        setEditModal({ ...editModal, doc: { ...editModal.doc, availableTimes: times } });
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        if(editModal.doc.availableTimes.length === 0) return alert("Please select at least one available appointment time slot.");
        try {
            await import("../../api.js").then(api => api.updateDoctorProfile(user.token, editModal.doc._id, editModal.doc));
            setEditModal({ show: false, doc: null });
            loadData();
        } catch (err) { alert("Failed to update doctor profile"); }
    };

    // -------------- Patient specific methods --------------
    const handleOpenBooking = (doc) => {
        setSelectedDoctor(doc);
        setBookingForm({ ...bookingForm, time: doc.availableTimes[0] || "" });
        setIsBookingModalOpen(true);
    };

    const handleBookAppointment = async (e) => {
        e.preventDefault();
        try {
            await createAppointment(user.token, {
                doctorId: selectedDoctor._id,
                doctorName: selectedDoctor.name,
                patientName: bookingForm.patientName,
                date: bookingForm.date,
                time: bookingForm.time
            });
            setIsBookingModalOpen(false);
            alert("Appointment request submitted and is Pending approval.");
            loadData();
        } catch (e) { alert("Failed to book appointment") }
    };

    return (
        <div className="w-full relative animate-in fade-in duration-500 pb-20">
            
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden mb-12 bg-sky-900 text-white shadow-2xl">
                <div className="absolute inset-0 opacity-20 bg-[url('https://images.unsplash.com/photo-1551076805-e1869043e560?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center mix-blend-overlay"></div>
                <div className="relative p-10 md:p-16 flex flex-col md:flex-row justify-between items-center gap-8 bg-gradient-to-r from-sky-900 via-sky-800/90 to-transparent">
                    <div className="max-w-2xl">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-sky-500/20 text-sky-200 border border-sky-500/30 rounded-full text-sm font-medium mb-6">
                            <Stethoscope size={16} /> World-class medical professionals
                        </div>
                        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4 leading-tight">Expert Consultations, Schedule With Ease</h1>
                        <p className="text-sky-100/80 text-lg max-w-xl">
                            Connect with leading specialists across multiple disciplines. Request your preferred appointment time directly through our portal for quick administrative approvals.
                        </p>
                    </div>
                </div>
            </div>

            {/* Role Header & Nav */}
            <div className="flex flex-col md:flex-row justify-between items-center mb-8 border-b border-slate-200 pb-4 gap-4">
                <div className="flex-1 w-full flex flex-col md:flex-row items-center gap-6">
                    <div>
                        <h2 className="text-3xl font-bold text-slate-800 tracking-tight">{isAdminOrDoc ? "Management Dashboard" : "Available Doctors"}</h2>
                        <p className="text-slate-500">{isAdminOrDoc ? "Control doctor registries and patient requests" : "Select a specialist and request an appointment time"}</p>
                    </div>
                    {(activeTab === "profiles" || activeTab === "directory") && (
                        <div className="relative w-full max-w-sm group">
                            <input
                                type="text"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                placeholder="Search by name or field..."
                                className="w-full pl-4 pr-4 py-2.5 rounded-2xl bg-white border border-slate-200 shadow-sm outline-none focus:border-sky-500 transition-all font-medium text-slate-600"
                            />
                        </div>
                    )}
                </div>
                
                <div className="flex gap-2 bg-slate-100 p-1 rounded-lg">
                    {isAdminOrDoc ? (
                        <>
                            <button onClick={()=>setActiveTab("profiles")} className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'profiles' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}>Profiles</button>
                            <button onClick={()=>setActiveTab("appointments")} className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'appointments' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}>
                                Requests {appointments.filter(a => a.status === 'Pending').length > 0 && <span className="ml-2 bg-rose-500 text-white px-2 py-0.5 rounded-full text-xs">{appointments.filter(a => a.status === 'Pending').length}</span>}
                            </button>
                        </>
                    ) : (
                        <>
                            <button onClick={()=>setActiveTab("directory")} className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'directory' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}>Directory</button>
                            <button onClick={()=>setActiveTab("my_bookings")} className={`px-4 py-2 rounded-md font-medium text-sm transition-colors ${activeTab === 'my_bookings' ? 'bg-white shadow-sm text-sky-600' : 'text-slate-500 hover:text-slate-700'}`}>My Bookings</button>
                        </>
                    )}
                </div>
            </div>

            {/* ----------------- ADMIN/DOC VIEW ----------------- */}
            {isAdminOrDoc && activeTab === "profiles" && (
                <>
                    <div className="glass-card p-6 mb-8 border border-sky-100 bg-sky-50/50">
                        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
                            <UserPlus size={20} className="text-sky-600" /> Administrative: Add Doctor Profile
                        </h3>
                        <form onSubmit={handleAddDoctor} className="space-y-4">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Image Upload (Auto Base64)</label>
                                    <label className="flex items-center gap-2 bg-white border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-50 text-sm overflow-hidden text-slate-500">
                                        <ImagePlus size={18} className="text-sky-500 flex-shrink-0" />
                                        <span className="truncate">{docForm.image ? "Image Selected" : "Choose Profile Picture"}</span>
                                        <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" required />
                                    </label>
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Doctor Full Name</label>
                                    <input placeholder="E.g. Dr. Sarah Jenkins" value={docForm.name} onChange={(e) => setDocForm({ ...docForm, name: e.target.value })} className="input-field bg-white" required />
                                </div>
                                <div>
                                    <label className="block text-xs font-semibold text-slate-600 mb-1">Specialization / Field</label>
                                    <input placeholder="E.g. Cardiologist" value={docForm.specialization} onChange={(e) => setDocForm({ ...docForm, specialization: e.target.value })} className="input-field bg-white" required />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Available Scheduling Slots</label>
                                <div className="flex flex-wrap gap-2">
                                    {shiftTimes.map(time => (
                                        <button 
                                            type="button" 
                                            key={time} 
                                            onClick={() => toggleTimeSelect(time)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${docForm.availableTimes.includes(time) ? 'bg-sky-500 text-white border-sky-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'}`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            
                            <button type="submit" className="btn-primary w-full md:w-auto px-8 bg-sky-600 hover:bg-sky-700 h-11">Save Doctor Profile</button>
                        </form>
                    </div>
                </>
            )}

            {isAdminOrDoc && activeTab === "appointments" && (
                 <div className="space-y-4">
                 {appointments.length === 0 ? <p className="text-slate-500 text-center py-10">No appointments recorded.</p> : appointments.map(a => (
                     <div key={a._id} className="glass-card p-6 flex flex-col md:flex-row justify-between gap-6 overflow-hidden relative">
                         {/* Status bar */}
                         <div className={`absolute left-0 top-0 bottom-0 w-2 ${a.status === 'Pending' ? 'bg-amber-400' : a.status === 'Approved' ? 'bg-emerald-400' : 'bg-rose-400'}`}></div>
                         
                         <div className="flex-1 pl-4">
                             <div className="flex items-center gap-3 mb-3">
                                 <span className={`px-2.5 py-1 rounded-md text-xs font-bold ${a.status === 'Pending' ? 'bg-amber-100 text-amber-700' : a.status === 'Approved' ? 'bg-emerald-100 text-emerald-700' : 'bg-rose-100 text-rose-700'}`}>
                                     {a.status} Request
                                 </span>
                                 <span className="text-slate-400 text-sm">Requested on {new Date(a.createdAt).toLocaleDateString()}</span>
                             </div>
                             
                             <h4 className="text-xl font-bold text-slate-800 mb-1">{a.patientName} <span className="text-slate-400 font-normal text-sm">wants to see</span> {a.doctorName}</h4>
                             
                             <div className="flex items-center gap-6 mt-4">
                                 <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                     <Calendar size={16} className="text-sky-500" /> <span className="font-medium text-sm">{a.date}</span>
                                 </div>
                                 <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100">
                                     <Clock size={16} className="text-amber-500" /> <span className="font-medium text-sm">{a.time}</span>
                                 </div>
                             </div>
                         </div>
                         
                         <div className="w-full md:w-48 flex flex-col gap-2 justify-center border-t md:border-t-0 pt-4 md:pt-0 border-slate-100">
                             {a.status === 'Pending' && (
                                 <>
                                     <button onClick={() => handleStatusUpdate(a._id, "Approved")} className="w-full bg-emerald-100 text-emerald-700 hover:bg-emerald-600 hover:text-white transition-colors text-sm font-bold py-2.5 rounded-xl flex items-center justify-center gap-2">
                                         <CheckCircle size={16}/> Approve
                                     </button>
                                     <button onClick={() => handleStatusUpdate(a._id, "Rejected")} className="w-full bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white transition-colors text-sm font-bold py-2.5 rounded-xl">
                                         Reject
                                     </button>
                                 </>
                             )}
                             {a.status !== 'Pending' && (
                                 <p className="text-center text-sm font-semibold text-slate-400 py-2">Action completed.</p>
                             )}
                         </div>
                     </div>
                 ))}
             </div>
            )}


            {/* ----------------- DIRECTORY DOCTOR PROFILES (Shared between all but used primarily by Patients) ----------------- */}
            {(activeTab === "profiles" || activeTab === "directory") && (
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {doctors.filter(d => d.name.toLowerCase().includes(searchTerm.toLowerCase()) || d.specialization.toLowerCase().includes(searchTerm.toLowerCase())).map(doc => (
                     <div key={doc._id} className="bg-white rounded-3xl border border-slate-100 p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative group overflow-hidden">
                         
                         {isAdminOrDoc && (user?.role === 'admin' || doc.userId === user?._id) && (
                             <div className="absolute top-4 right-4 flex flex-col gap-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                                 {doc.userId === user?._id && (
                                 <button onClick={() => setEditModal({ show: true, doc })} className="bg-white p-2 rounded-full shadow-md text-sky-500 hover:bg-sky-50 hover:scale-110 transition-transform">
                                     <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/><path d="m15 5 4 4"/></svg>
                                 </button>
                                 )}
                                 <button onClick={() => handleDeleteDoctor(doc._id)} className="bg-white text-rose-500 p-2 rounded-full shadow-md hover:bg-rose-50 hover:scale-110 transition-transform">
                                     <Trash2 size={16} />
                                 </button>
                             </div>
                         )}

                         <div className="flex gap-4 items-center border-b border-slate-100 pb-5 mb-5">
                             <div className="w-20 h-20 rounded-full bg-sky-50 border-4 border-sky-100 flex items-center justify-center overflow-hidden flex-shrink-0">
                                 {doc.image ? (
                                     <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                                 ) : (
                                     <User size={32} className="text-sky-300" />
                                 )}
                             </div>
                             <div>
                                 <h3 className="text-xl font-bold text-slate-800 tracking-tight leading-tight mb-1">{doc.name}</h3>
                                 <div className="inline-flex max-w-fit px-2.5 py-0.5 rounded-full bg-sky-50 text-sky-700 text-xs font-bold uppercase tracking-wider mb-1 mt-1">
                                     {doc.specialization}
                                 </div>
                             </div>
                         </div>
                         
                         <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Available Shifts</p>
                         <div className="flex flex-wrap gap-2 mb-6">
                             {doc.availableTimes.map((t, idx) => (
                                 <span key={idx} className="bg-slate-50 border border-slate-200 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                                     {t}
                                 </span>
                             ))}
                         </div>

                         {!isAdminOrDoc && (
                             <button onClick={() => handleOpenBooking(doc)} className="w-full bg-slate-800 hover:bg-sky-600 text-white font-medium py-3 rounded-xl transition-colors flex items-center justify-center gap-2 group-hover:shadow-lg shadow-sky-200">
                                 Request Appointment <ChevronRight size={16} />
                             </button>
                         )}
                     </div>
                 ))}
             </div>
            )}


            {/* ----------------- PATIENT BOOKINGS VIEW ----------------- */}
            {!isAdminOrDoc && activeTab === "my_bookings" && (
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     {appointments.length === 0 ? <div className="col-span-full py-10 text-center text-slate-500">You have zero booked appointments. Check the Directory to book one!</div> : appointments.map(a => (
                         <div key={a._id} className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm flex items-center justify-between">
                             <div>
                                 <div className={`text-xs font-bold mb-2 uppercase flex items-center gap-1.5 w-fit px-2 py-0.5 rounded ${a.status === 'Pending' ? 'bg-amber-50 text-amber-600' : a.status === 'Approved' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                                     {a.status === 'Pending' && <Clock size={12}/>}
                                     {a.status === 'Approved' && <CheckCircle size={12}/>}
                                     {a.status === 'Rejected' && <X size={12}/>}
                                     {a.status}
                                 </div>
                                 <h4 className="font-bold text-slate-800 text-lg mb-1">{a.doctorName}</h4>
                                 <div className="flex gap-4 text-sm text-slate-500 font-medium">
                                     <span className="flex items-center gap-1"><Calendar size={14} className="text-sky-500"/> {a.date}</span>
                                     <span className="flex items-center gap-1"><Clock size={14} className="text-amber-500"/> {a.time}</span>
                                 </div>
                             </div>
                             {a.status === 'Pending' && (
                                 <button onClick={() => deleteAppointment(user.token, a._id).then(loadData)} className="p-2.5 bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white rounded-xl transition-colors" title="Cancel Request">
                                     <Trash2 size={18}/>
                                 </button>
                             )}
                         </div>
                     ))}
                 </div>
            )}


            {/* ----------------- BOOKING MODAL ----------------- */}
            {isBookingModalOpen && selectedDoctor && (
                <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsBookingModalOpen(false)}></div>
                    <div className="relative bg-white rounded-3xl w-full max-w-md shadow-2xl p-6 sm:p-8 animate-in zoom-in-95 duration-200">
                        <button onClick={() => setIsBookingModalOpen(false)} className="absolute top-4 right-4 text-slate-400 hover:bg-slate-100 p-1.5 rounded-full"><X size={20}/></button>
                        
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">Book Consultation</h2>
                        <p className="text-slate-500 text-sm mb-6 pb-4 border-b border-slate-100 flex items-center gap-2">With <span className="font-bold text-slate-700">{selectedDoctor.name}</span></p>

                        <form onSubmit={handleBookAppointment} className="space-y-5">
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">For Patient Name</label>
                                <input type="text" value={bookingForm.patientName} onChange={(e) => setBookingForm({...bookingForm, patientName: e.target.value})} className="input-field bg-slate-50 h-12" required />
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Date</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none border-r border-slate-200 pr-3">
                                        <Calendar size={18} className="text-sky-500" />
                                    </div>
                                    <input type="date" value={bookingForm.date} min={new Date().toISOString().split("T")[0]} onChange={(e) => setBookingForm({...bookingForm, date: e.target.value})} className="input-field bg-slate-50 h-12 pl-14 font-medium" required />
                                </div>
                            </div>
                            
                            <div>
                                <label className="block text-sm font-semibold text-slate-700 mb-1.5">Select Specific Shift Time</label>
                                <div className="grid grid-cols-2 gap-3">
                                    {selectedDoctor.availableTimes.length === 0 ? <p className="text-sm text-rose-500 col-span-2">This doctor has not declared any available shifts.</p> : 
                                        selectedDoctor.availableTimes.map((t, i) => (
                                            <label key={i} className={`flex items-center justify-center p-3 rounded-xl border-2 cursor-pointer font-bold text-sm transition-all ${bookingForm.time === t ? 'border-sky-500 bg-sky-50 text-sky-700 shadow-sm' : 'border-slate-200 text-slate-500 hover:border-sky-200 hover:bg-slate-50'}`}>
                                                <input type="radio" name="time" value={t} checked={bookingForm.time === t} onChange={(e) => setBookingForm({...bookingForm, time: e.target.value})} className="hidden" />
                                                {t}
                                            </label>
                                        ))
                                    }
                                </div>
                            </div>

                            <button type="submit" disabled={!bookingForm.time} className="btn-primary w-full bg-sky-600 hover:bg-sky-700 h-12 text-lg shadow-lg shadow-sky-200 mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
                                Request Appointment
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {editModal.show && editModal.doc && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
                    <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditModal({ show: false, doc: null })}></div>
                    <div className="relative bg-white rounded-[2.5rem] p-8 max-w-md w-full shadow-2xl">
                        <button onClick={() => setEditModal({ show: false, doc: null })} className="absolute top-6 right-6 text-slate-400 hover:bg-slate-100 p-1.5 rounded-full"><X size={20}/></button>
                        <h3 className="text-2xl font-bold text-slate-800 tracking-tight mb-6 flex items-center gap-2">Edit Doctor Profile</h3>
                        
                        <form onSubmit={handleEditSubmit} className="space-y-4">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Image Update (Auto Base64)</label>
                                <label className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-2.5 rounded-xl cursor-pointer hover:bg-slate-100 text-sm overflow-hidden text-slate-500">
                                    <ImagePlus size={18} className="text-sky-500 flex-shrink-0" />
                                    <span className="truncate">Change Image</span>
                                    <input type="file" accept="image/*" onChange={handleEditImageChange} className="hidden" />
                                </label>
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Doctor Full Name</label>
                                <input value={editModal.doc.name} onChange={(e) => setEditModal({...editModal, doc: {...editModal.doc, name: e.target.value}})} className="input-field" required />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Specialization / Field</label>
                                <input value={editModal.doc.specialization} onChange={(e) => setEditModal({...editModal, doc: {...editModal.doc, specialization: e.target.value}})} className="input-field" required />
                            </div>
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-2">Available Scheduling Slots</label>
                                <div className="flex flex-wrap gap-2 max-h-[100px] overflow-y-auto">
                                    {shiftTimes.map(time => (
                                        <button 
                                            type="button" 
                                            key={time} 
                                            onClick={() => toggleEditTimeSelect(time)}
                                            className={`px-3 py-1.5 rounded-lg text-sm font-medium border transition-colors ${editModal.doc.availableTimes.includes(time) ? 'bg-sky-500 text-white border-sky-600 shadow-sm' : 'bg-white text-slate-600 border-slate-200 hover:border-sky-300'}`}
                                        >
                                            {time}
                                        </button>
                                    ))}
                                </div>
                            </div>
                            <div className="flex gap-3 pt-4">
                                <button type="button" onClick={() => setEditModal({ show: false, doc: null })} className="flex-1 btn bg-slate-100 text-slate-600 font-bold py-3 hover:bg-slate-200 rounded-xl transition-all">Cancel</button>
                                <button type="submit" className="flex-1 btn-primary bg-sky-600 hover:bg-sky-700 py-3 rounded-xl transition-all h-auto">Save Changes</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
