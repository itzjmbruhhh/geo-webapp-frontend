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

    return (
        <div className={styles.page}>
            <div className={styles.card}>
                <div className={styles.header}>
                    <p className={styles.coords}>14°35'N · 120°58'E</p>
                    <h2 className={styles.title}>LOCATE.IO</h2>
                    <p className={styles.subtitle}>Sign in to access your dashboard</p>
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

                <p className={styles.footer}>SIGNAL ENCRYPTED · TLS 1.3</p>
            </div>
        </div>
    );
};

export default Login;