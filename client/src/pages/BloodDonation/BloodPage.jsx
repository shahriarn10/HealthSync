import { useEffect, useState } from "react";
import { getBloodData } from "../../api";

export default function BloodPage() {
    const [data, setData] = useState(null);
    const user = JSON.parse(localStorage.getItem("user"));

    useEffect(() => {
        const fetchData = async () => {
            const res = await getBloodData(user.token);
            setData(res.data);
        };
        fetchData();
    }, [user.token]);

    return (
        <div style={{ margin: "2rem" }}>
            <h2>Blood Donation Section</h2>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
}
