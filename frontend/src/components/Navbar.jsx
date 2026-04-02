import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <div style={{
            position: "fixed", bottom: "30px", left: "50%", transform: "translateX(-50%)",
            backgroundColor: "rgba(30, 41, 59, 0.8)", backdropFilter: "blur(10px)",
            padding: "10px 30px", borderRadius: "30px", display: "flex", gap: "40px",
            border: "1px solid rgba(255,255,255,0.1)", boxShadow: "0 10px 30px rgba(0,0,0,0.5)",
            zIndex: 1000
        }}>
            <button onClick={() => navigate("/dashboard")} style={navBtnStyle}>Feed</button>
            <button onClick={() => navigate("/profile")} style={navBtnStyle}>Profile</button>
            <button onClick={() => navigate("/edit-profile")} style={navBtnStyle}>Edit</button>
            <button onClick={() => { localStorage.clear(); navigate("/login"); }} style={navBtnStyle}>Logout</button>
            <button onClick={() => navigate("/network")} style={navBtnStyle}>Network</button>
        </div>
    );
}

const navBtnStyle = {
    background: "none", border: "none", color: "white", cursor: "pointer",
    fontSize: "14px", fontWeight: "600", transition: "0.3s"
};