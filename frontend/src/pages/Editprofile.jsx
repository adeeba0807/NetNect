import { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function EditProfile() {
    const { token } = useContext(AuthContext);
    
    console.log("Current Token from Context:", token);
    
    // State to hold form data
    const [formData, setFormData] = useState({ 
        bio: "", 
        education: "", 
        pastWork: "" 
    });

    // The logic function lives INSIDE the component
    const handleUpdate = async () => {
        try {
            await api.post("/update_profile_data", { 
                token: token, 
                bio: formData.bio,
                education: formData.education,
                pastWork: formData.pastWork
            });
            
            alert("Profile Updated!");
        } catch (err) {
            console.log("Full Error Object:", err);
            alert("Error: " + (err.response?.status || "Server Offline") + " - " + err.message);
        }
    };

    const uploadPhoto = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const formData = new FormData();
        formData.append("token", token);
        formData.append("profile_picture", file);

        try {
            await api.post("/update_profile_picture", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Picture Updated!");
            window.location.reload();
        } catch (err) {
            alert("Upload failed");
        }
    };

    return (
        <div className="auth-container" style={{display: 'block', overflowY: 'auto', padding: '40px 20px'}}>
            <Navbar />
            <div className="edit-form-container">
                <h2 style={{color: '#38bdf8'}}>Edit Your Creative Profile</h2>

                <input type="file" onChange={uploadPhoto} />
                
                <div style={{ display: "flex", flexDirection: "column", gap: "15px" }}>
                    <textarea 
                        className="netnect-input" 
                        style={{minHeight: '100px'}} 
                        placeholder="Tell your story (Bio)..." 
                        onChange={(e) => setFormData({...formData, bio: e.target.value})} 
                    />
                    
                    <input 
                        className="netnect-input" 
                        placeholder="Education (e.g., University Name)" 
                        onChange={(e) => setFormData({...formData, education: e.target.value})} 
                    />
                    
                    <textarea 
                        className="netnect-input" 
                        style={{minHeight: '100px'}} 
                        placeholder="Experience / Projects" 
                        onChange={(e) => setFormData({...formData, pastWork: e.target.value})} 
                    />
                    
                    <button className="primary-btn" onClick={handleUpdate}>
                        Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}