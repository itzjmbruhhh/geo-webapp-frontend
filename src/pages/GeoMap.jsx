import { useEffect, useRef } from "react";
import L from "leaflet";
import styles from "./GeoMap.module.css";

// Fix Leaflet's broken default icon paths when bundled with Vite/webpack
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
    iconUrl:       "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    shadowUrl:     "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

const DEFAULT_ZOOM = 13;
const TILE_URL     = "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const TILE_ATTR    = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>';

const createPinIcon = () =>
    L.divIcon({
        className: "",
        html: `
            <div class="geo-pin-wrapper">
                <div class="geo-pin-pulse"></div>
                <div class="geo-pin-dot"></div>
            </div>`,
        iconSize:   [20, 20],
        iconAnchor: [10, 10],
    });

const GeoMap = ({ lat, lng, ip, city, country }) => {
    const containerRef = useRef(null);
    const mapRef       = useRef(null);
    const markerRef    = useRef(null);

    const parsedLat = parseFloat(lat);
    const parsedLng = parseFloat(lng);
    const isValid   = !isNaN(parsedLat) && !isNaN(parsedLng) && lat !== "—" && lng !== "—";

    // Init map once
    useEffect(() => {
        if (!containerRef.current) return;

        // Guard against StrictMode double-invoke
        if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current  = null;
            markerRef.current = null;
        }

        const initialCoords = isValid ? [parsedLat, parsedLng] : [20, 0];
        const initialZoom   = isValid ? DEFAULT_ZOOM : 2;

        const map = L.map(containerRef.current, {
            zoomControl:       false,
            attributionControl: false,
        }).setView(initialCoords, initialZoom);

        L.tileLayer(TILE_URL, { attribution: TILE_ATTR, maxZoom: 19 }).addTo(map);

        L.control.attribution({ position: "bottomright", prefix: false }).addTo(map);
        L.control.zoom({ position: "topright" }).addTo(map);

        if (isValid) {
            markerRef.current = L.marker([parsedLat, parsedLng], {
                icon: createPinIcon(),
            }).addTo(map);
        }

        mapRef.current = map;

        return () => {
            map.remove();
            mapRef.current    = null;
            markerRef.current = null;
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Fly to new coords on update
    useEffect(() => {
        if (!mapRef.current || !isValid) return;

        const coords = [parsedLat, parsedLng];
        mapRef.current.flyTo(coords, DEFAULT_ZOOM, { animate: true, duration: 1.2 });

        if (markerRef.current) {
            markerRef.current.setLatLng(coords);
        } else {
            markerRef.current = L.marker(coords, { icon: createPinIcon() })
                .addTo(mapRef.current);
        }
    }, [lat, lng, isValid, parsedLat, parsedLng]);

    return (
        <div className={styles.mapWrapper}>

            {/* Header bar */}
            <div className={styles.mapHeader}>
                <span className={styles.mapTag}>MAP</span>
                <span className={styles.mapCoords}>
                    {isValid
                        ? `${parsedLat.toFixed(4)}° N · ${parsedLng.toFixed(4)}° E`
                        : "NO SIGNAL"}
                </span>
                {city && (
                    <span className={styles.mapLocation}>
                        {city}{country ? `, ${country}` : ""}
                    </span>
                )}
            </div>

            {/* Leaflet mount point */}
            <div className={styles.mapContainer}>
                <div ref={containerRef} className={styles.leaflet} />
                <div className={styles.mapTint} />

                {!isValid && (
                    <div className={styles.noSignal}>
                        <span className={styles.noSignalIcon}>⊕</span>
                        <p className={styles.noSignalText}>AWAITING COORDINATES</p>
                    </div>
                )}
            </div>

            {/* IP badge */}
            {ip && (
                <div className={styles.mapFooter}>
                    <span className={styles.mapIP}>{ip}</span>
                </div>
            )}
        </div>
    );
};

export default GeoMap;