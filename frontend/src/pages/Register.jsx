import { useState } from "react";
import api from "../api";
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
    const [formData, setFormData] = useState({ name: "", username: "", email: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleRegister = async () => {
        try {
            const response = await api.post("/register", formData);
            alert(response.data.message);
            navigate("/login");
        } catch (err) {
            alert(err.response?.data?.message || "Registration failed");
        }
    };

    return (
        <div className="auth-container">
            <div className="glass-card">
                <h1 style={{color: 'white', letterSpacing: '-2px'}}>NetNect</h1>
                <p style={{color: '#94a3b8', marginBottom: '30px'}}>Create your creative profile</p>
                
                <input className="netnect-input" placeholder="Full Name" onChange={(e) => setFormData({...formData, name: e.target.value})} />
                <input className="netnect-input" placeholder="Username" onChange={(e) => setFormData({...formData, username: e.target.value})} />
                <input className="netnect-input" placeholder="Email" onChange={(e) => setFormData({...formData, email: e.target.value})} />
                <div style={{ position: 'relative' }}>
                    <input 
                        className="netnect-input" 
                        type={showPassword ? "text" : "password"} 
                        placeholder="Password" 
                        onChange={(e) => setFormData({...formData, password: e.target.value})}
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
                
                <button className="primary-btn" onClick={handleRegister}>Create Account</button>
                
                <p style={{ marginTop: "20px", color: "#94a3b8" }}>
                    Already have an account? <Link to="/login" style={{ color: "#38bdf8", textDecoration: "none" }}>Login</Link>
                </p>
            </div>
        </div>
    );
}