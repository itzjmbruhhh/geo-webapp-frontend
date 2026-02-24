import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../services/api";

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
        <div style={{ padding: "2rem" }}>
            <h2>Login</h2>
            {error && <p style={{ color: "red" }}>{error}</p>}
            <form onSubmit={handleSubmit}>
                <div>
                    <input
                        type="email"
                        placeholder="Email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                </div>
                <div>
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                </div>
                <button type="submit" style={{ marginTop: "1rem" }}>Login</button>
            </form>
        </div>
    );
};

export default Login;