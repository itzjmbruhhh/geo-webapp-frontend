import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";
import styles from './Login.module.css';

const Login = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (token) navigate("/home");
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await login(email, password);
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
            <div className={styles.mapPanel}>
                <div className={styles.mapBrand}>
                    <h1 className={styles.mapBrandName}>LOCATE.IO</h1>
                    <p className={styles.mapBrandSub}>IP Geolocation Platform</p>
                </div>
                <div className={styles.mapFooter}>
                    <p className={styles.mapStat}>UPTIME <span>99.98%</span></p>
                    <p className={styles.mapStat}>NODES <span>142</span></p>
                    <p className={styles.mapStat}>SIGNAL <span>ACTIVE</span></p>
                </div>
            </div>

            {/* Right — form */}
            <div className={styles.formPanel}>
                <div className={styles.header}>
                    <p className={styles.coords}>14°35'N · 120°58'E</p>
                    <h2 className={styles.title}>ACCESS TERMINAL</h2>
                    <p className={styles.subtitle}>Sign in to your dashboard</p>
                </div>
                <div className={styles.divider} />

                {error && <p className={styles.error}>⚠ {error}</p>}

                <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Email</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>@</span>
                            <input className={styles.input} type="email" placeholder="user@domain.com"
                                   value={email} onChange={(e) => setEmail(e.target.value)} required />
                        </div>
                    </div>

                    <div className={styles.fieldGroup}>
                        <label className={styles.label}>Password</label>
                        <div className={styles.inputWrapper}>
                            <span className={styles.inputIcon}>⊹</span>
                            <input className={styles.input} type="password" placeholder="••••••••"
                                   value={password} onChange={(e) => setPassword(e.target.value)} required />
                        </div>
                    </div>

                    <button className={styles.button} type="submit">Authenticate</button>
                </form>

                <p className={styles.footer}>github.com/itzjmbruhhh · @2026</p>
            </div>
        </div>
    );
};

export default Login;