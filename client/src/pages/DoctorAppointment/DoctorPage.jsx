import { useEffect, useState } from "react";
import { getDoctorData } from "../../api";

export default function DoctorPage() {
    const [data, setData] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchData = async () => {
            const res = await getDoctorData(user.token);
            setData(res.data);
        };
        fetchData();
    }, [user.token]);

    return (
        <div style={{ margin: "2rem" }}>
            <h2>Doctor Appointment Section</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
