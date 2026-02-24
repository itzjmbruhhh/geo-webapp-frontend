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
}

export default Home;