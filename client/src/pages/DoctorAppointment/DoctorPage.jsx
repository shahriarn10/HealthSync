import { useEffect, useState } from "react";
import { getDoctorData, addDoctorData, deleteAppointment } from "../../api";

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
        <div style={{ margin: "2rem" }}>
            <h2>Doctor Appointments</h2>
            <form onSubmit={handleAdd}>
                <input name="doctorName" placeholder="Doctor" value={form.doctorName}
                    onChange={(e) => setForm({ ...form, doctorName: e.target.value })} />
                <input name="patientName" placeholder="Patient" value={form.patientName}
                    onChange={(e) => setForm({ ...form, patientName: e.target.value })} />
                <input name="date" placeholder="Date" value={form.date}
                    onChange={(e) => setForm({ ...form, date: e.target.value })} />
                <input name="time" placeholder="Time" value={form.time}
                    onChange={(e) => setForm({ ...form, time: e.target.value })} />
                <button type="submit">Add</button>
            </form>

            <ul>
                {appointments.map(a => (
                    <li key={a._id}>
                        {a.patientName} → {a.doctorName} on {a.date} at {a.time}
                        <button onClick={() => handleDelete(a._id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
}
