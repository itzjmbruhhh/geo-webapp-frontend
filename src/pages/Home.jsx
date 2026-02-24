import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory, saveHistory, deleteHistory } from "../services/api";
import axios from "axios";
import styles from "./Home.module.css";

const isValidIP = (ip) =>
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);

const GeoField = ({ label, value, highlight }) => (
    <div className={styles.geoField}>
        <span className={styles.geoKey}>{label}</span>
        <span className={`${styles.geoValue} ${highlight ? styles.highlight : ""}`}>
      {value || "—"}
    </span>
    </div>
);

const Home = () => {
    const navigate = useNavigate();
    const token = localStorage.getItem("token");
    const [geo, setGeo] = useState(null);
    const [ip, setIP] = useState("");
    const [history, setHistory] = useState([]);
    const [error, setError] = useState("");

    const fetchGeo = async (targetIP = "", save = false) => {
        try {
            const url = targetIP
                ? `https://ipinfo.io/${targetIP}/geo`
                : `https://ipinfo.io/geo`;
            const res = await axios.get(url);
            setGeo(res.data);
            if (save) await saveHistory(token, res.data);
            fetchHistory();
            setError("");
        } catch {
            setError("ERR · INVALID IP OR FETCH FAILED");
        }
    };

    const fetchHistory = async () => {
        const res = await getHistory(token);
        setHistory(res.data);
    };

    const handleSearch = () => {
        if (!isValidIP(ip)) return setError("ERR · INVALID IPv4 FORMAT");
        fetchGeo(ip, true);
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

    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    useEffect(() => { fetchGeo(); }, []);

    const [lat, lng] = geo?.loc?.split(",") ?? ["—", "—"];
    const selectedCount = history.filter((h) => h.selected).length;

    return (
        <div className={styles.page}>

            {/* ── Topbar ── */}
            <header className={styles.topbar}>
                <div className={styles.brand}>
                    <p className={styles.brandName}>LOCATE.IO</p>
                    <p className={styles.brandCoords}>IP GEOLOCATION DASHBOARD</p>
                </div>
                <div className={styles.topbarRight}>
                    <span className={styles.statusDot}>SIGNAL ACTIVE</span>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        ⊗ Logout
                    </button>
                </div>
            </header>

            {/* ── Main ── */}
            <div className={styles.main}>

                {/* ── Search Bar ── */}
                <div className={styles.searchBar}>
                    <span className={styles.searchLabel}>Target IP</span>
                    <div className={styles.searchInputWrapper}>
                        <span className={styles.searchPrefix}>⌖</span>
                        <input
                            className={styles.searchInput}
                            placeholder="000.000.000.000"
                            value={ip}
                            onChange={(e) => setIP(e.target.value)}
                            onKeyDown={handleKeyDown}
                        />
                    </div>
                    <button className={styles.btnSearch} onClick={handleSearch}>
                        Locate →
                    </button>
                    <button className={styles.btnClear} onClick={handleClear}>
                        Reset
                    </button>
                    {error && <p className={styles.errorBadge}>{error}</p>}
                </div>

                {/* ── Geo Panel ── */}
                <section className={styles.geoPanel}>
                    <div className={styles.panelHeader}>
                        <span className={styles.panelTag}>Live</span>
                        <h3 className={styles.panelTitle}>Geo Data</h3>
                    </div>

                    {geo ? (
                        <>
                            <div className={styles.ipHero}>
                                <p className={styles.ipAddress}>{geo.ip}</p>
                                <p className={styles.ipOrg}>{geo.org || "Unknown Organization"}</p>
                            </div>

                            <div className={styles.geoGrid}>
                                <GeoField label="City"     value={geo.city} />
                                <GeoField label="Region"   value={geo.region} />
                                <GeoField label="Country"  value={geo.country} />
                                <GeoField label="Postal"   value={geo.postal} />
                                <GeoField label="Timezone" value={geo.timezone} />
                                <GeoField label="Hostname" value={geo.hostname} highlight />
                            </div>

                            <div className={styles.coordsRow}>
                                <span className={styles.coordsLabel}>Coordinates</span>
                                <span className={styles.coordsValue}>
                  {lat}° N &nbsp;·&nbsp; {lng}° E
                </span>
                            </div>
                        </>
                    ) : (
                        <div className={styles.emptyGeo}>
                            <span className={styles.emptyIcon}>⊕</span>
                            <p className={styles.emptyText}>Awaiting target</p>
                        </div>
                    )}
                </section>

                {/* ── History Panel ── */}
                <aside className={styles.historyPanel}>
                    <div className={styles.historyHeader}>
                        <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                            <h3 className={styles.historyTitle}>History</h3>
                            <span className={styles.historyCount}>{history.length}</span>
                        </div>
                        <button
                            className={styles.btnDelete}
                            onClick={handleDelete}
                            disabled={!selectedCount}
                        >
                            {selectedCount ? `✕ Remove (${selectedCount})` : "✕ Remove"}
                        </button>
                    </div>

                    <ul className={styles.historyList}>
                        {history.length === 0 ? (
                            <div className={styles.emptyHistory}>
                                <p className={styles.emptyHistoryText}>No records found</p>
                            </div>
                        ) : (
                            history.map((h) => (
                                <li
                                    key={h._id}
                                    className={`${styles.historyItem} ${h.selected ? styles.selected : ""}`}
                                >
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={h.selected || false}
                                        onChange={() => setHistory(
                                            history.map((x) =>
                                                x._id === h._id ? { ...x, selected: !x.selected } : x
                                            )
                                        )}
                                    />
                                    <div
                                        className={styles.historyMeta}
                                        onClick={() => fetchGeo(h.ip)} // ← save defaults to false, no duplicate
                                    >
                                        <span className={styles.historyIP}>{h.ip}</span>
                                        <span className={styles.historyLocation}>
                      {h.city}, {h.country}
                    </span>
                                    </div>
                                    <span className={styles.historyArrow}>→</span>
                                </li>
                            ))
                        )}
                    </ul>
                </aside>
            </div>
        </div>
    );
};

export default Home;