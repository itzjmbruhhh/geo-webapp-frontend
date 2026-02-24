/**
 * Login Component
 * 
 * Provides authentication interface with a split-panel design:
 * - Left panel: Decorative map branding with system statistics
 * - Right panel: Login form with email/password authentication
 * 
 * Automatically redirects to /home if user is already authenticated
 */

import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import styles from './Login.module.css';

const Login = () => {
    // Form state management
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    /**
     * Check if user is already authenticated on component mount
     * Redirects to home page if valid token exists in localStorage
     */
    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/home");
    }, []);

    /**
     * Handle login form submission
     * Authenticates user credentials via API and stores JWT token
     */
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(email, password);
            // Store authentication token in localStorage
            localStorage.setItem("token", res.data.token);
            navigate("/home");
        } catch (err) {
            setError(err.response?.data?.message || "Login failed");
        }
    };

    // Login.jsx — updated structure
    return (
        <div className={styles.page}>

            {/* Left — decorative map panel */}
            {/* Displays branding and system status indicators for visual appeal */}
            <div className={styles.mapPanel}>
                {/* Brand identity section */}
                <div className={styles.mapBrand}>
                    <h1 className={styles.mapBrandName}>LOCATE.IO</h1>
                    <p className={styles.mapBrandSub}>IP Geolocation Platform</p>
                </div>
                {/* System statistics footer - shows uptime, node count, and signal status */}
                <div className={styles.mapFooter}>
                    <p className={styles.mapStat}>UPTIME <span>99.98%</span></p>
                    <p className={styles.mapStat}>NODES <span>142</span></p>
                    <p className={styles.mapStat}>SIGNAL <span>ACTIVE</span></p>
                </div>
            </div>

            {/* Right — form */}
            {/* Authentication form panel with input fields */}
            <div className={styles.formPanel}>
                {/* Header section with coordinates decoration and title */}
                <div className={styles.header}>
                    <p className={styles.coords}>14°35'N · 120°58'E</p>
                    <h2 className={styles.title}>ACCESS TERMINAL</h2>
                    <p className={styles.subtitle}>Sign in to your dashboard</p>
                </div>
                <div className={styles.divider} />

                {/* Display error message if authentication fails */}
                {error && <p className={styles.error}>⚠ {error}</p>}

                {/* Login form with email and password fields */}
                <form className={styles.form} onSubmit={handleSubmit}>
                    {/* Email input field with @ icon */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Email</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>@</span>
                            <input className={styles.input} type="email" placeholder="user@domain.com"
                                   value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    </div>

                    {/* Password input field with decorative icon */}
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Password</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>⊹</span>
                            <input className={styles.input} type="password" placeholder="••••••••"
                                   value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    </div>

                    {/* Submit button triggers authentication */}
                    <button className={styles.button} type="submit">Authenticate</button>
                </form>

                {/* Footer with attribution */}
                <p className={styles.footer}>github.com/itzjmbruhhh · @2026</p>
            </div>
        </div>
    );
};

export default Login;