/**
 * GeoMap Component
 * 
 * Interactive map component using Leaflet to display IP geolocation data.
 * Features:
 * - Custom animated pin markers with pulse effect
 * - Smooth fly-to animation when coordinates change
 * - Fallback state for invalid coordinates
 * - Header showing coordinates and location info
 * - OpenStreetMap tile layer
 */

import { useEffect, useRef } from "react";
import L from "leaflet";
import styles from "./GeoMap.module.css";

// Fix Leaflet's broken default icon paths when bundled with Vite/webpack
// This is necessary because module bundlers break Leaflet's auto-detection
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Map configuration constants
const DEFAULT_ZOOM = 13; // Zoom level for valid coordinates
const TILE_URL     = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTR    = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

/**
 * Creates a custom animated pin icon for map markers
 * Includes a pulsing effect and centered dot
 * 
 * @returns {L.DivIcon} Leaflet div icon with custom HTML
 */
const createPinIcon = () =>
    L.divIcon({
        className: "",
        html: `
            <div class="geo-pin-wrapper">
                <div class="geo-pin-pulse"></div>
                <div class="geo-pin-dot"></div>
            </div>`,
        iconSize:   [20, 20],
        iconAnchor: [10, 10], // Center the icon on coordinates
    });

const GeoMap = ({ lat, lng, ip, city, country }) => {
    // Refs to maintain map instance across re-renders
    const containerRef = useRef(null);
    const mapRef       = useRef(null);
    const markerRef    = useRef(null);

    // Parse and validate coordinates
    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    // Check if coordinates are valid numbers and not placeholder values
    const isValid   = !isNaN(parsedLat) && !isNaN(parsedLng) && lat !== "—" && lng !== "—";

    /**
     * Initialize map on component mount
     * Sets up Leaflet map with controls, tile layer, and initial marker if coordinates are valid
     * Includes cleanup to prevent memory leaks and handle React StrictMode double-invocation
     */
    // Init map once
    useEffect(() => {
        if (!containerRef.current) return;

        // Guard against StrictMode double-invoke
        // Remove existing map instance if present to prevent duplicates
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current  = null;
            markerRef.current = null;
        }

        // Set initial map position: use provided coords if valid, otherwise show world view
        const initialCoords = isValid ? [parsedLat, parsedLng] : [20, 0];
        const initialZoom   = isValid ? DEFAULT_ZOOM : 2;

        // Create Leaflet map instance with custom control positioning
        const map = L.map(containerRef.current, {
            zoomControl:       false, // We'll add it manually to position it
            attributionControl: false, // We'll add it manually
        }).setView(initialCoords, initialZoom);

        // Add OpenStreetMap tile layer for map visualization
        L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map);

        // Add attribution control to bottom-right
        L.control.attribution({ position: "bottomright", prefix: false }).addTo(map);
        // Add zoom controls to top-right
        L.control.zoom({ position: "topright" }).addTo(map);

        // Add initial marker if coordinates are valid
        if (isValid) {
            markerRef.current = L.marker([parsedLat, parsedLng], {
                icon: createPinIcon(),
            }).addTo(map);
        }

        mapRef.current = map;

        // Cleanup function: remove map instance when component unmounts
        return () => {
            map.remove();
            mapRef.current    = null;
            markerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    /**
     * Update map view when coordinates change
     * Smoothly animates to new location and updates/creates marker
     */
    // Fly to new coords on update
    useEffect(() => {
        // Skip if map not initialized or coordinates invalid
        if (!mapRef.current || !isValid) return;

        const coords = [parsedLat, parsedLng];
        // Animate map movement to new coordinates with smooth flyTo animation
        mapRef.current.flyTo(coords, DEFAULT_ZOOM, { animate: true, duration: 1.2 });

        // Update existing marker or create new one
        if (markerRef.current) {
            // Marker exists, just update its position
            markerRef.current.setLatLng(coords);
        } else {
            // No marker yet, create and add to map
            markerRef.current = L.marker(coords, { icon: createPinIcon() })
                .addTo(mapRef.current);
        }
    }, [lat, lng, isValid, parsedLat, parsedLng]);

    return (
        <div className={styles.mapWrapper}>

            {/* Header bar */}
            {/* Displays MAP label, coordinates (or NO SIGNAL), and location info */}
            <div className={styles.mapHeader}>
                <span className={styles.mapTag}>MAP</span>
                <span className={styles.mapCoords}>
                    {/* Show formatted coordinates if valid, otherwise show error state */}
                    {isValid
                        ? `${parsedLat.toFixed(4)}° N · ${parsedLng.toFixed(4)}° E`
                        : "NO SIGNAL"}
                </span>
                {/* Display city and country if available */}
                {city && (
                    <span className={styles.mapLocation}>
                        {city}{country ? `, ${country}` : ""}
                    </span>
                )}
            </div>

            {/* Leaflet mount point */}
            {/* Container for the actual map and overlay elements */}
            <div className={styles.mapContainer}>
                {/* DOM element where Leaflet map will be mounted */}
                <div ref={containerRef} className={styles.leaflet} />
                {/* Tint overlay for styling effect */}
                <div className={styles.mapTint} />

                {/* Show "awaiting coordinates" message when no valid coordinates */}
                {!isValid && (
                    <div className={styles.noSignal}>
                        <span className={styles.noSignalIcon}>⊕</span>
                        <p className={styles.noSignalText}>AWAITING COORDINATES</p>
                    </div>
                )}
            </div>

            {/* IP badge */}
            {/* Footer showing the IP address being displayed */}
            {ip && (
                <div className={styles.mapFooter}>
                    <span className={styles.mapIP}>{ip}</span>
                </div>
            )}
        </div>
    );
};

export default GeoMap;