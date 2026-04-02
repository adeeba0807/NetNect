import { useContext, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { API_URL } from "../api";
import Navbar from "../components/Navbar";
import { AuthContext } from "../context/AuthContext";

export default function PublicProfile() {
    const { userId } = useParams();
    const { token } = useContext(AuthContext);
    const [profile, setProfile] = useState(null);
    const [posts, setPosts] = useState([]);
    const [errorMessage, setErrorMessage] = useState("");
    const [connectionState, setConnectionState] = useState("none");
    const [incomingRequestId, setIncomingRequestId] = useState("");
    const [isActionLoading, setIsActionLoading] = useState(false);

    const fetchConnectionState = async () => {
        if (!token || !userId) return;

        try {
            const [resInc, resSent, resMe] = await Promise.all([
                api.get("/user/user_connection_request", { params: { token } }),
                api.get("/user/getConnnectionRequests", { params: { token } }),
                api.get("/get_user_and_profile", { params: { token } })
            ]);

            const myId = resMe.data?.profile?.userId?._id;
            if (myId && myId === userId) {
                setConnectionState("self");
                return;
            }

            const incomingList = Array.isArray(resInc.data) ? resInc.data : [];
            const sentList = resSent.data?.connections || [];

            const incoming = incomingList.find((req) => req.userId?._id === userId && req.status_accepted !== true);
            if (incoming) {
                setIncomingRequestId(incoming._id);
                setConnectionState("incoming");
                return;
            }

            const acceptedIncoming = incomingList.find((req) => req.userId?._id === userId && req.status_accepted === true);
            if (acceptedIncoming) {
                setConnectionState("connected");
                return;
            }

            const sent = sentList.find((req) => req.connectionId?._id === userId);
            if (sent) {
                if (sent.status_accepted === true) {
                    setConnectionState("connected");
                } else {
                    setConnectionState("pending");
                }
                return;
            }

            setConnectionState("none");
        } catch (error) {
            console.error("Connection state error:", error);
        }
    };

    useEffect(() => {
        const fetchPublicProfile = async () => {
            try {
                const response = await api.get(`/public_profile?id=${userId}`);
                setProfile(response.data.profile);
            } catch (error) {
                setErrorMessage(error.response?.data?.message || "Failed to load profile");
            }
        };

        const fetchUserPosts = async () => {
            try {
                const response = await api.get(`/user_posts?userId=${userId}`);
                setPosts(response.data.posts || []);
            } catch (error) {
                console.error("Failed to load user posts:", error);
            }
        };

        if (userId) {
            fetchPublicProfile();
            fetchUserPosts();
            fetchConnectionState();
        }
    }, [userId, token]);

    const handleConnect = async () => {
        try {
            setIsActionLoading(true);
            await api.post("/user/send_connection_request", {
                token,
                connectionId: userId,
            });
            setConnectionState("pending");
        } catch (error) {
            alert(error.response?.data?.message || "Failed to send request");
        } finally {
            setIsActionLoading(false);
        }
    };

    const handleIncomingAction = async (action) => {
        try {
            setIsActionLoading(true);
            await api.post("/user/accept_connection_request", {
                token,
                requestId: incomingRequestId,
                action_type: action,
            });

            if (action === "accept") {
                setConnectionState("connected");
            } else {
                setConnectionState("none");
            }
        } catch (error) {
            alert(error.response?.data?.message || "Action failed");
        } finally {
            setIsActionLoading(false);
        }
    };

    const renderConnectionActions = () => {
        if (!token || connectionState === "self") return null;

        if (connectionState === "incoming") {
            return (
                <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
                    <button
                        className="primary-btn"
                        style={{ width: "auto", padding: "10px 16px" }}
                        onClick={() => handleIncomingAction("accept")}
                        disabled={isActionLoading}
                    >
                        Accept
                    </button>
                </div>
            );
        }

        if (connectionState === "pending") {
            return (
                <button
                    className="vibe-btn"
                    style={{ width: "auto", padding: "10px 16px", marginTop: "12px", cursor: "not-allowed", opacity: 0.75 }}
                    disabled
                >
                    Pending
                </button>
            );
        }

        if (connectionState === "connected") {
            return (
                <button
                    className="vibe-btn"
                    style={{ width: "auto", padding: "10px 16px", marginTop: "12px", cursor: "default", opacity: 0.85 }}
                    disabled
                >
                    Connected
                </button>
            );
        }

        return (
            <button
                className="primary-btn"
                style={{ width: "auto", padding: "10px 20px", marginTop: "12px" }}
                onClick={handleConnect}
                disabled={isActionLoading}
            >
                Connect
            </button>
        );
    };

    const showEmail = connectionState === "connected" || connectionState === "self";

    if (errorMessage) {
        return (
            <div className="auth-container" style={{ display: "block", overflowY: "auto", padding: "40px 20px" }}>
                <Navbar />
                <div className="glass-card" style={{ margin: "100px auto 0", width: "auto", maxWidth: "700px" }}>
                    <h2 style={{ color: "#f87171" }}>Could not open profile</h2>
                    <p>{errorMessage}</p>
                </div>
            </div>
        );
    }

    if (!profile) {
        return <div className="auth-container"><h2>Loading profile...</h2></div>;
    }

    return (
        <div className="auth-container" style={{ display: "block", overflowY: "auto", padding: "40px 20px" }}>
            <Navbar />
            <div className="profile-container">
                <div className="profile-header-card">
                    <img className="profile-avatar" src={`${API_URL}/${profile.userId.profilePicture}`} alt="Profile" />
                    <div style={{ textAlign: "left" }}>
                        <h1 style={{ margin: 0, fontSize: "2.8rem" }}>{profile.userId.name}</h1>
                        <p style={{ color: "#38bdf8", fontWeight: "700", textTransform: "uppercase" }}>
                            @{profile.userId.username}
                        </p>
                        {showEmail && (
                            <p style={{ color: "#94a3b8", marginTop: "-4px", marginBottom: "8px" }}>
                                {profile.userId.email}
                            </p>
                        )}
                        <p style={{ color: "#94a3b8", maxWidth: "500px" }}>{profile.bio || "No bio yet"}</p>
                        {renderConnectionActions()}
                    </div>
                </div>

                <div className="network-grid">
                    <div className="glass-card" style={{ width: "auto", textAlign: "left" }}>
                        <h3 style={{ color: "#38bdf8" }}>Learning</h3>
                        <p>{profile.education || "No education details"}</p>
                    </div>
                    <div className="glass-card" style={{ width: "auto", textAlign: "left" }}>
                        <h3 style={{ color: "#38bdf8" }}>Experience</h3>
                        <p>{profile.pastWork || "No experience details"}</p>
                    </div>
                </div>

                <div style={{ marginTop: "30px" }}>
                    <h2 style={{ textAlign: "left", marginBottom: "16px" }}>Posts</h2>
                    {posts.length === 0 ? (
                        <div className="glass-card" style={{ width: "auto", textAlign: "left" }}>
                            <p style={{ color: "#94a3b8" }}>No posts yet.</p>
                        </div>
                    ) : (
                        posts.map((post) => (
                            <div key={post._id} className="post-card">
                                <p style={{ marginTop: 0, lineHeight: "1.6" }}>{post.body}</p>
                                {post.media && <img className="post-media-img" src={`${API_URL}/${post.media}`} alt="media" />}
                                <div className="interaction-bar">
                                    <button className="vibe-btn" disabled style={{ cursor: "default" }}>⚡ {post.likes} Likes</button>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
