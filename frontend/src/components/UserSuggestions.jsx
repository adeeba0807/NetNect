import { useState, useEffect } from "react";
import api, { API_URL } from "../api";

export default function UserSuggestions() {
    const [profiles, setProfiles] = useState([]);
    const token = localStorage.getItem("token");

    const fetchFilteredSuggestions = async () => {
        try {
            // 1. Fetch all users
            const resAll = await api.get("/get_all_users");
            
            // 2. Fetch requests you've already sent
            const resSent = await api.get("/user/getConnnectionRequests", {
                params: { token }
            });

            const allProfiles = resAll.data.profiles || [];
            const mySentRequests = resSent.data.connections || [];

            // 3. Create a set of IDs that already have pending/sent requests
            const sentIds = new Set(mySentRequests.map(req => req.connectionId._id));

            // 4. Filter the suggestions list
            const filtered = allProfiles.filter(profile => {
                // Return true only if the ID is NOT in the sentIds set
                return !sentIds.has(profile.userId._id);
            });

            setProfiles(filtered);
        } catch (err) {
            console.log("Filtering error:", err);
        }
    };

    useEffect(() => {
        if (token) fetchFilteredSuggestions();
    }, [token]);

    const handleConnect = async (targetId) => {
        try {
            await api.post("/user/send_connection_request", {
                token: token,
                connectionId: targetId
            });

            alert("Connection Request Sent!");
            
            // Immediately remove from UI without waiting for refresh
            setProfiles(prev => prev.filter(p => p.userId._id !== targetId));
        } catch (err) {
            console.error("Connection Error:", err);
            alert("Error: " + (err.response?.data?.message || "Check Console"));
        }
    };

    return (
        <div className="suggestions-card">
            <h4 className="suggestions-title">Discover Professionals</h4>
            
            <div className="suggestions-list">
                {profiles.length === 0 ? (
                    <p className="no-suggestions">No new suggestions for now.</p>
                ) : (
                    profiles.map((profile) => (
                        <div key={profile._id} className="creator-row">
                            <div className="creator-info">
                                <img 
                                    src={`${API_URL}/${profile.userId?.profilePicture}`} 
                                    className="creator-avatar"
                                    alt="avatar"
                                    onError={(e) => e.target.src = "https://via.placeholder.com/150"}
                                />
                                <div className="creator-text">
                                    <span className="creator-name">{profile.userId?.name}</span>
                                    <span className="creator-handle">@{profile.userId?.username}</span>
                                </div>
                            </div>
                            
                            <button 
                                className="connect-mini-btn"
                                onClick={() => handleConnect(profile.userId?._id)}
                            >
                                Connect
                            </button>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}