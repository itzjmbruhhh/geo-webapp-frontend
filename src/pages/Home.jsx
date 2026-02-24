/**
 * Home Component - Main Dashboard
 * 
 * IP Geolocation dashboard with comprehensive features:
 * - Search and locate IP addresses using ipinfo.io API
 * - Display detailed geolocation data (city, region, country, coordinates, etc.)
 * - Interactive map visualization with Leaflet
 * - Search history management (save, view, delete)
 * - Auto-detect user's own IP on initial load
 * 
 * Layout:
 * - Top: Navigation bar with branding and logout
 * - Left column: Search bar, geo data panel, interactive map
 * - Right column: History panel with clickable records
 */

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getHistory, saveHistory, deleteHistory } from "../services/api";
import axios from "axios";
import styles from "./Home.module.css";
import GeoMap from "./GeoMap";

/**
 * Validates if a string is a valid IPv4 address
 * Checks each octet is between 0-255 and follows proper format
 */
const isValidIP = (ip) =>
    /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/.test(ip);

/**
 * GeoField Component
 * Displays a single geolocation data field with label and value
 */
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
    const token = localStorage.getItem("token"); // JWT token for authenticated API requests
    
    // Component state
    const [geo, setGeo] = useState(null);        // Current geolocation data
    const [ip, setIP] = useState("");            // IP input field value
    const [history, setHistory] = useState([]);  // Search history records
    const [error, setError] = useState("");      // Error message display

    /**
     * Fetch geolocation data for a given IP address
     * If no IP provided, fetches data for the user's own IP
     */
    const fetchGeo = async (targetIP = "", save = false) => {
        try {
            // Build API URL: specific IP or auto-detect user's IP
            const url = targetIP
                ? `https://ipinfo.io/${targetIP}/geo`
                : `https://ipinfo.io/geo`;
            const res = await axios.get(url);
            setGeo(res.data);
            // Save to history if this was a user search (not initial load)
            if (save) await saveHistory(token, res.data);
            fetchHistory();
            setError("");
        } catch {
            setError("ERR · INVALID IP OR FETCH FAILED");
        }
    };

    /**
     * Fetch user's search history from the backend
     */
    const fetchHistory = async () => {
        const res = await getHistory(token);
        setHistory(res.data);
    };

    /**
     * Handle IP search button click
     * Validates IP format before making API request
     */
    const handleSearch = () => {
        if (!isValidIP(ip)) return setError("ERR · INVALID IPv4 FORMAT");
        fetchGeo(ip, true); // true = save to history
    };

    /**
     * Clear the search input and reset to user's own IP
     */
    const handleClear = () => {
        setIP("");
        fetchGeo(); // Fetch user's own IP
    };

    /**
     * Delete selected history items from the database
     * Only processes items that have been checked by user
     */
    const handleDelete = async () => {
        const selected = history.filter((h) => h.selected).map((h) => h._id);
        if (!selected.length) return;
        await deleteHistory(token, selected);
        fetchHistory(); // Refresh history list
    };

    /**
     * Log out user by removing token and redirecting to login
     */
    const handleLogout = () => {
        localStorage.removeItem("token");
        navigate("/");
    };

    /**
     * Allow Enter key to trigger search
     */
    const handleKeyDown = (e) => {
        if (e.key === "Enter") handleSearch();
    };

    // Fetch user's own IP geolocation on component mount
    useEffect(() => { fetchGeo(); }, []);

    // Extract coordinates from geo data (format: "lat,lng")
    const [lat, lng] = geo?.loc?.split(",") ?? ["—", "—"];
    // Count how many history items are currently selected
    const selectedCount = history.filter((h) => h.selected).length;

    return (
        <div className={styles.page}>

            {/* ── Topbar ── */}
            {/* Navigation header with branding, status indicator, and logout button */}
            <header className={styles.topbar}>
                {/* Left side: Application branding */}
                <div className={styles.brand}>
                    <p className={styles.brandName}>LOCATE.IO</p>
                    <p className={styles.brandCoords}>IP GEOLOCATION DASHBOARD</p>
                </div>
                {/* Right side: Status and logout */}
                <div className={styles.topbarRight}>
                    <span className={styles.statusDot}>SIGNAL ACTIVE</span>
                    <button className={styles.logoutBtn} onClick={handleLogout}>
                        ⊗ Logout
                    </button>
                </div>
            </header>

            {/* ── Main grid ── */}
            {/* Main content area with 3-column layout: geo panel, map, and history */}
            <div className={styles.main}>

                {/* ── Search Bar ── */}
                {/* IP address input with search and clear buttons */}
                <div className={styles.searchBar}>
                    <span className={styles.searchLabel}>Target IP</span>
                    {/* Input wrapper with target icon */}
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
                    {/* Search button triggers IP lookup and saves to history */}
                    <button className={styles.btnSearch} onClick={handleSearch}>
                        Locate →
                    </button>
                    {/* Reset button clears input and shows user's own IP */}
                    <button className={styles.btnClear} onClick={handleClear}>
                        Reset
                    </button>
                    {/* Display validation or API error messages */}
                    {error && <p className={styles.errorBadge}>{error}</p>}
                </div>

                {/* ── Geo data panel (top-left) ── */}
                {/* Displays detailed geolocation information for the current IP */}
                <section className={styles.geoPanel}>
                    {/* Panel header with "Live" tag */}
                    <div className={styles.panelHeader}>
                        <span className={styles.panelTag}>Live</span>
                        <h3 className={styles.panelTitle}>Geo Data</h3>
                    </div>

                    {/* Show geo data if available, otherwise show empty state */}
                    {geo ? (
                        <>
                            {/* IP address and organization display */}
                            <div className={styles.ipHero}>
                                <p className={styles.ipAddress}>{geo.ip}</p>
                                <p className={styles.ipOrg}>{geo.org || "Unknown Organization"}</p>
                            </div>
                            {/* Grid of geolocation fields (city, region, etc.) */}
                            <div className={styles.geoGrid}>
                                <GeoField label="City"     value={geo.city} />
                                <GeoField label="Region"   value={geo.region} />
                                <GeoField label="Country"  value={geo.country} />
                                <GeoField label="Postal"   value={geo.postal} />
                                <GeoField label="Timezone" value={geo.timezone} />
                                <GeoField label="Hostname" value={geo.hostname} highlight />
                            </div>
                            {/* Coordinates display row */}
                            <div className={styles.coordsRow}>
                                <span className={styles.coordsLabel}>Coordinates</span>
                                <span className={styles.coordsValue}>
                                    {lat}° N &nbsp;·&nbsp; {lng}° E
                                </span>
                            </div>
                        </>
                    ) : (
                        // Empty state when no geo data loaded yet
                        <div className={styles.emptyGeo}>
                            <span className={styles.emptyIcon}>⊕</span>
                            <p className={styles.emptyText}>Awaiting target</p>
                        </div>
                    )}
                </section>

                {/* ── Map panel (bottom-left) ── */}
                {/* Interactive Leaflet map showing pin at IP location */}
                <div className={styles.mapPanel}>
                    <GeoMap
                        lat={lat}
                        lng={lng}
                        ip={geo?.ip}
                        city={geo?.city}
                        country={geo?.country}
                    />
                </div>

                {/* ── History panel (right column) ── */}
                {/* Sidebar showing previously searched IP addresses */}
                <aside className={styles.historyPanel}>
                    {/* Header with title, record count, and delete button */}
                    <div className={styles.historyHeader}>
                        <div className={styles.historyTitleGroup}>
                            <h3 className={styles.historyTitle}>History</h3>
                            {/* Badge showing total number of history records */}
                            <span className={styles.historyCount}>{history.length}</span>
                        </div>
                        {/* Delete button - enabled only when items are selected */}
                        <button
                            className={styles.btnDelete}
                            onClick={handleDelete}
                            disabled={!selectedCount}
                        >
                            {selectedCount ? `✕ Remove (${selectedCount})` : "✕ Remove"}
                        </button>
                    </div>

                    {/* Scrollable list of history records */}
                    <ul className={styles.historyList}>
                        {/* Show empty state if no history records */}
                        {history.length === 0 ? (
                            <div className={styles.emptyHistory}>
                                <p className={styles.emptyHistoryText}>No records found</p>
                            </div>
                        ) : (
                            // Render each history record as a clickable list item
                            history.map((h) => (
                                <li
                                    key={h._id}
                                    className={`${styles.historyItem} ${h.selected ? styles.selected : ""}`}
                                >
                                    {/* Checkbox for selecting items to delete */}
                                    <input
                                        type="checkbox"
                                        className={styles.checkbox}
                                        checked={h.selected || false}
                                        onChange={() => setHistory(
                                            // Toggle selected state for this item
                                            history.map((x) =>
                                                x._id === h._id ? { ...x, selected: !x.selected } : x
                                            )
                                        )}
                                    />
                                    {/* Clickable area - clicking loads this IP's geo data */}
                                    <div
                                        className={styles.historyMeta}
                                        onClick={() => fetchGeo(h.ip)}
                                    >
                                        <span className={styles.historyIP}>{h.ip}</span>
                                        <span className={styles.historyLocation}>
                                            {h.city}, {h.country}
                                        </span>
                                    </div>
                                    {/* Visual indicator showing this item is clickable */}
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