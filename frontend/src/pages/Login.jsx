import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api/axios";
import { useAuth } from "../context/AuthContext";

function Login() {
    const navigate = useNavigate();
    const { user, setUser } = useAuth();

    const [formData, setFormData] = useState({ email: "", password: "" });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        setError("");
        setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    };

    useEffect(() => {
        if (user) {
            navigate("/chat");
        }
    }, [user, navigate]);

    const validate = () => {
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

        if (!validate()) return;

        setLoading(true);
        try {
            const response = await API.post("/auth/login", formData);
            localStorage.setItem("token", response.data.token);
            setUser(response.data.user);
            navigate("/chat");
        } catch (error) {
            setError(error.response?.data?.message || "Invalid credentials. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=DM+Sans:wght@300;400;500&display=swap');

                *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

                .auth-root {
                    min-height: 100vh;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    background-color: #f5f3ef;
                    font-family: 'DM Sans', sans-serif;
                    padding: 1rem;
                }

                .auth-card {
                    background: #fff;
                    border: 1px solid #e8e4dc;
                    border-radius: 16px;
                    padding: 2.5rem 2.25rem;
                    width: 100%;
                    max-width: 380px;
                }

                .auth-wordmark {
                    font-family: 'Instrument Serif', serif;
                    font-size: 1.75rem;
                    color: #1a1916;
                    letter-spacing: -0.02em;
                    margin-bottom: 0.25rem;
                }

                .auth-subtitle {
                    font-size: 0.8125rem;
                    color: #9a9589;
                    font-weight: 300;
                    margin-bottom: 2rem;
                }

                .auth-field {
                    margin-bottom: 0.875rem;
                }

                .auth-label {
                    display: block;
                    font-size: 0.75rem;
                    font-weight: 500;
                    color: #6b6760;
                    letter-spacing: 0.04em;
                    text-transform: uppercase;
                    margin-bottom: 0.4rem;
                }

                .auth-input {
                    width: 100%;
                    border: 1px solid #e0dbd2;
                    border-radius: 8px;
                    padding: 0.65rem 0.875rem;
                    font-size: 0.9rem;
                    font-family: 'DM Sans', sans-serif;
                    color: #1a1916;
                    background: #faf9f7;
                    outline: none;
                    transition: border-color 0.15s, background 0.15s;
                }

                .auth-input:focus {
                    border-color: #b5a98a;
                    background: #fff;
                }

                .auth-input::placeholder {
                    color: #c4bfb5;
                }

                .auth-error {
                    font-size: 0.8rem;
                    color: #c0392b;
                    background: #fdf2f2;
                    border: 1px solid #f5c6c6;
                    border-radius: 6px;
                    padding: 0.5rem 0.75rem;
                    margin-bottom: 1rem;
                }

                .auth-btn {
                    width: 100%;
                    padding: 0.7rem;
                    background: #1a1916;
                    color: #f5f3ef;
                    border: none;
                    border-radius: 8px;
                    font-size: 0.875rem;
                    font-family: 'DM Sans', sans-serif;
                    font-weight: 500;
                    letter-spacing: 0.02em;
                    cursor: pointer;
                    margin-top: 0.5rem;
                    transition: opacity 0.15s;
                }

                .auth-btn:hover:not(:disabled) { opacity: 0.85; }
                .auth-btn:disabled { opacity: 0.5; cursor: not-allowed; }

                .auth-footer {
                    margin-top: 1.25rem;
                    text-align: center;
                    font-size: 0.8125rem;
                    color: #9a9589;
                }

                .auth-footer a {
                    color: #1a1916;
                    font-weight: 500;
                    text-decoration: none;
                    border-bottom: 1px solid #d4cfc4;
                    padding-bottom: 1px;
                    transition: border-color 0.15s;
                }

                .auth-footer a:hover { border-color: #1a1916; }

                .auth-divider {
                    height: 1px;
                    background: #eeebe4;
                    margin: 1.5rem 0;
                }
            `}</style>

            <div className="auth-root">
                <div className="auth-card">
                    <p className="auth-wordmark">Welcome back</p>
                    <p className="auth-subtitle">Sign in to continue your conversations</p>

                    <form onSubmit={handleSubmit}>
                        {error && <div className="auth-error">{error}</div>}

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
                        </div>

                        <button type="submit" className="auth-btn" disabled={loading}>
                            {loading ? "Signing in…" : "Sign in"}
                        </button>
                    </form>

                    <div className="auth-divider" />

                    <p className="auth-footer">
                        No account?{" "}
                        <Link to="/register">Create one</Link>
                    </p>
                </div>
            </div>
        </>
    );
}

export default Login;