import { useState, useContext } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../context/AuthContext";

export default function Login() {
    const [formData, setFormData] = useState({ email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetForm, setResetForm] = useState({ email: "", newPassword: "", confirmPassword: "" });
    const { setToken } = useContext(AuthContext); 
    const navigate = useNavigate();

    const handleLogin = async () => {
        try {
            const response = await api.post("/login", formData);
            const userToken = response.data.token;
            
            setToken(userToken); 
            alert("Login Successful!");
            navigate("/dashboard"); 
        } catch (err) {
            alert(err.response?.data?.message || "Login failed");
        }
    };

    const handleForgotPassword = async () => {
        try {
            const response = await api.post("/forgot_password", resetForm);
            alert(response.data.message);
            setShowForgotPassword(false);
            setResetForm({ email: "", newPassword: "", confirmPassword: "" });
        } catch (err) {
            alert(err.response?.data?.message || "Password reset failed");
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-card">
                <h1 style={{ color: 'white', letterSpacing: '-2px', margin: '0' }}>NetNect</h1>
                <p style={{ color: '#94a3b8', marginBottom: '30px', fontSize: '14px' }}>
                    Welcome back to your creative network
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', textAlign: 'left' }}>
                    <input 
                        className="netnect-input"
                        placeholder="Email Address" 
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })} 
                    />
                    <div style={{ position: 'relative' }}>
                        <input 
                            className="netnect-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Password" 
                            onChange={(e) => setFormData({ ...formData, password: e.target.value })} 
                            style={{ paddingRight: '90px' }}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword((prev) => !prev)}
                            style={{
                                position: 'absolute',
                                right: '10px',
                                top: '50%',
                                transform: 'translateY(-50%)',
                                background: 'transparent',
                                border: 'none',
                                color: '#38bdf8',
                                cursor: 'pointer',
                                fontSize: '12px',
                                fontWeight: '600'
                            }}
                        >
                            {showPassword ? 'Hide' : 'Show'}
                        </button>
                    </div>
                </div>

                <button className="primary-btn" onClick={handleLogin} style={{ marginTop: '10px' }}>
                    Login
                </button>

                <button
                    type="button"
                    onClick={() => setShowForgotPassword((prev) => !prev)}
                    style={{
                        marginTop: '12px',
                        background: 'transparent',
                        border: 'none',
                        color: '#38bdf8',
                        cursor: 'pointer',
                        fontSize: '13px'
                    }}
                >
                    Forgot password?
                </button>

                {showForgotPassword && (
                    <div style={{ marginTop: '16px', textAlign: 'left' }}>
                        <input
                            className="netnect-input"
                            placeholder="Account email"
                            value={resetForm.email}
                            onChange={(e) => setResetForm({ ...resetForm, email: e.target.value })}
                        />
                        <input
                            className="netnect-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="New password"
                            value={resetForm.newPassword}
                            onChange={(e) => setResetForm({ ...resetForm, newPassword: e.target.value })}
                        />
                        <input
                            className="netnect-input"
                            type={showPassword ? "text" : "password"}
                            placeholder="Confirm new password"
                            value={resetForm.confirmPassword}
                            onChange={(e) => setResetForm({ ...resetForm, confirmPassword: e.target.value })}
                        />
                        <button className="primary-btn" onClick={handleForgotPassword} style={{ marginTop: '6px' }}>
                            Reset Password
                        </button>
                    </div>
                )}

                <p style={{ marginTop: "20px", fontSize: "14px", color: "#94a3b8" }}>
                    Don't have an account?{" "}
                    <Link to="/register" style={{ color: "#38bdf8", textDecoration: "none", fontWeight: "bold" }}>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
}