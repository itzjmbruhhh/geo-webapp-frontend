import { useEffect, useState } from "react";
import { getHistory, saveHistory, deleteHistory } from "../services/api.js";
import axios from "axios";
import App from "../App.jsx";

const isValidIP = (ip) =>
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.(?!$)|$){4}$/.test(ip);

const Home = () => {
    const token = localStorage.getItem("token");
    const [geo, setGeo] = useState();
    const [ip, setIp] = useState();
    const [history, setHistory] = useState({});
    const [error, setError] = useState(null);

    const fetchGeo = async (targetIP = "") => {
        try {
            const url = targetIP ? `https://ipinfo.io/${targetIP}/geo` : `https://ipinfo.io/geo`;
            const res = await axios.get(url);
            setGeo(res.data);
            if (targetIP) await saveHistory(token, res.data);
            fetchHistory();
            setError("");
        } catch (error) {
            setError("Invalid IP or fetch error");
        }
    };

    const fetchHistory = async () => {
        const res = await getHistory(token);
        setHistory(res.data);
    };

    const handleSearch = () => {
      if(!isValidIP(ip)) return setError("Invalid IP");
      fetchGeo(ip);
    };

    const handleClear = () => {
        setIP("");
        fetchGeo();
    };

    const handleDelete = async () => {
        const selected = history.filter((h) => h.selected).map((h) => h._id);
        if (!selected.length) return;
        await deleteHistory(token, selected);
        fetchHistory();
    };

    useEffect(() => {
        fetchGeo();
    }, []);

    return (
        <div style={{ padding: "2rem" }}>
            <h2>Home</h2>
            <div>
                <input
                    placeholder="Enter IP"
                    value={ip}
                    onChange={(e) => setIP(e.target.value)}
                />
                <button onClick={handleSearch}>Search</button>
                <button onClick={handleClear}>Clear</button>
            </div>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <div style={{ marginTop: "1rem" }}>
                <h3>Geo Info</h3>
                <pre>{JSON.stringify(geo, null, 2)}</pre>
            </div>
            <div>
                <h3>History</h3>
                <button onClick={handleDelete}>Delete Selected</button>
                <ul>
                    {history.map((h) => (
                        <li key={h._id}>
                            <input
                                type="checkbox"
                                checked={h.selected || false}
                                onChange={() => {
                                    h.selected = !h.selected;
                                    setHistory([...history]);
                                }}
                            />
                            <span onClick={() => fetchGeo(h.ip)} style={{ cursor: "pointer" }}>
                {h.ip} - {h.city}, {h.country}
              </span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
}

export default Home;