import { useState, useEffect, useContext } from "react";
import api, { API_URL } from "../api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";
import { useNavigate } from "react-router-dom";

export default function Network() {
    const [incoming, setIncoming] = useState([]);
    const [sent, setSent] = useState([]);
    const [connections, setConnections] = useState([]);
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

   const fetchData = async () => {
    try {
        // 1. Fetch Incoming (People wanting to connect with YOU)
        // Route: /user/user_connection_request (GET)
        const resInc = await api.get("/user/user_connection_request", { 
            params: { token } // GET requests use 'params'
        });
        const allIncoming = Array.isArray(resInc.data) ? resInc.data : [];
        setIncoming(allIncoming.filter(r => r.status_accepted !== true));
        setConnections(allIncoming.filter(r => r.status_accepted === true));

        // 2. Fetch Sent (Requests sent BY you)
        // Route: /user/getConnnectionRequests (GET)
        const resSent = await api.get("/user/getConnnectionRequests", { 
            params: { token } 
        });
        const sentRequests = resSent.data.connections || [];
        setSent(sentRequests.filter(req => req.status_accepted !== true));

    } catch (err) { 
        console.log("Network fetch error:", err); 
    }
};

    // --- NEW ACTION FUNCTION ---
    const handleAction = async (requestId, action) => {
        try {
            await api.post("/user/accept_connection_request", {
                token,
                requestId,
                action_type: action // "accept" or "decline"
            });
            alert(`Request ${action}ed!`);
            fetchData(); // Refresh the lists automatically
        } catch (err) {
            alert("Action failed");
        }
    };

    useEffect(() => { if(token) fetchData(); }, [token]);

    return (
        <div className="auth-container" style={{display: 'block', overflowY: 'auto', padding: '40px 20px'}}>
            <Navbar />
            <div style={{ maxWidth: "800px", margin: "0 auto" }}>
                <h2 style={{ color: "#38bdf8", textAlign: 'left' }}>NetNect Connections</h2>
                <div className="network-grid">
                    <div>
                        <h3 style={{textAlign: 'left'}}>Invitations</h3>
                        {incoming.map(req => (
                            <div key={req._id} className="connection-card">
                                <img src={`${API_URL}/${req.userId.profilePicture}`} style={{width: '40px', height: '40px', borderRadius: '10px'}} />
                                <span style={{flex: 1, textAlign: 'left'}}>{req.userId.name}</span>
                                
                                {/* --- UPDATED BUTTON --- */}
                                <button 
                                    onClick={() => handleAction(req._id, "accept")}
                                    className="primary-btn" 
                                    style={{width: 'auto', padding: '5px 10px', fontSize: '12px', marginRight: '5px'}}
                                >
                                    Accept
                                </button>
                            </div>
                        ))}
                    </div>
                    <div>
                        <h3 style={{textAlign: 'left'}}>Current Connections</h3>
                        {connections.map(req => (
                            <div key={req._id} className="connection-card">
                                <img src={`${API_URL}/${req.userId.profilePicture}`} style={{width: '40px', height: '40px', borderRadius: '10px'}} />
                                <span
                                    style={{flex: 1, textAlign: 'left', cursor: 'pointer', color: '#f8fafc'}}
                                    onClick={() => navigate(`/profile/${req.userId._id}`)}
                                >
                                    {req.userId.name}
                                </span>
                                <span style={{color: '#10b981', fontSize: '10px'}}>
                                    CONNECTED
                                </span>
                            </div>
                        ))}

                        <h3 style={{textAlign: 'left', marginTop: '20px'}}>Sent Requests</h3>
                        {sent.map(req => (
                            <div key={req._id} className="connection-card">
                                <img src={`${API_URL}/${req.connectionId.profilePicture}`} style={{width: '40px', height: '40px', borderRadius: '10px'}} />
                                <span style={{flex: 1, textAlign: 'left'}}>{req.connectionId.name}</span>
                                <span style={{color: req.status_accepted ? '#10b981' : '#38bdf8', fontSize: '10px'}}>
                                    {req.status_accepted ? 'CONNECTED' : 'PENDING'}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}