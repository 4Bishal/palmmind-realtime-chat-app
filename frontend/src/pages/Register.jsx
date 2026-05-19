import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";
import './Auth.css';

function Register() {
    const navigate = useNavigate();

    const { user } = useAuth();

    const [formData, setFormData] = useState({ username: "", email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setError("");
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        // If already authenticated, redirect to chat
        if (user) {
            navigate("/chat");
        }
    }, [user, navigate]);

    const validate = () => {
        if (!formData.username || formData.username.trim().length < 3) {
            setError("Username must be at least 3 characters");
            return false;
        }

        const emailRegex = /^\S+@\S+\.\S+$/;
        if (!formData.email || !emailRegex.test(formData.email)) {
            setError("Please provide a valid email address");
            return false;
        }

        if (!formData.password || formData.password.length < 6) {
            setError("Password must be at least 6 characters");
            return false;
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");

        // Client-side validation
        if (!validate()) return;

        setLoading(true);
        try {
            await API.post("/auth/register", formData);
            navigate("/login");
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-root">
            <div className="auth-card">
                <p className="auth-wordmark">Create account</p>
                <p className="auth-subtitle">Join and start chatting instantly</p>

                <form onSubmit={handleSubmit}>
                    {error && <div className="auth-error">{error}</div>}

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="username">Username</label>
                        <input
                            id="username"
                            type="text"
                            name="username"
                            className="auth-input"
                            placeholder="yourname"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="email">Email</label>
                        <input
                            id="email"
                            type="email"
                            name="email"
                            className="auth-input"
                            placeholder="you@example.com"
                            onChange={handleChange}
                            required
                        />
                    </div>

                    <div className="auth-field">
                        <label className="auth-label" htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            name="password"
                            className="auth-input"
                            placeholder="••••••••"
                            onChange={handleChange}
                            required
                        />
                        <p className="password-hint">At least 6 characters</p>
                    </div>

                    <button type="submit" className="auth-btn" disabled={loading}>
                        {loading ? "Creating account…" : "Create account"}
                    </button>
                </form>

                <div className="auth-divider" />

                <p className="auth-footer">
                    Already have an account?{" "}
                    <Link to="/login">Sign in</Link>
                </p>
            </div>
        </div>
    );
}

export default Register;