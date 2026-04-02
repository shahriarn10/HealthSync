import { useEffect, useState } from "react";
import { getPharmacyData } from "../../api";

export default function PharmacyPage() {
    const [data, setData] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchData = async () => {
            const res = await getPharmacyData(user.token);
            setData(res.data);
        };
        fetchData();
    }, [user.token]);

    return (
        <div style={{ margin: "2rem" }}>
            <h2>Pharmacy Section</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
