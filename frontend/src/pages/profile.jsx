import { useState, useEffect, useContext } from "react";
import api, { API_URL } from "../api";
import { AuthContext } from "../context/AuthContext";
import Navbar from "../components/Navbar";

export default function Profile() {
    const { token } = useContext(AuthContext);
    const [data, setData] = useState(null);
    const [posts, setPosts] = useState([]);

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const res = await api.get(`/get_user_and_profile?token=${token}`);
                setData(res.data);

                const userId = res.data?.profile?.userId?._id;
                if (userId) {
                    const postsRes = await api.get(`/user_posts?userId=${userId}`);
                    setPosts(postsRes.data.posts || []);
                }
            } catch (err) { console.error(err); }
        };
        if (token) fetchProfile();
    }, [token]);

    if (!data) return <div className="auth-container"><h2>Loading Creative Space...</h2></div>;

    return (
        <div className="auth-container" style={{display: 'block', overflowY: 'auto', padding: '40px 20px'}}>
            <Navbar />
            <div className="profile-container">
                <div className="profile-header-card">
                    <img className="profile-avatar" src={`${API_URL}/${data.profile.userId.profilePicture}`} alt="Profile" />
                    <div style={{textAlign: 'left'}}>
                        <h1 style={{ margin: 0, fontSize: "2.8rem" }}>{data.profile.userId.name}</h1>
                        <p style={{ color: "#38bdf8", fontWeight: "700", textTransform: "uppercase", margin: "6px 0" }}>
                            @{data.profile.userId.username}
                        </p>
                        <p style={{ color: "#94a3b8", marginTop: "-2px", marginBottom: "8px" }}>
                            {data.profile.userId.email}
                        </p>
                        <p style={{ color: "#38bdf8", fontWeight: "700", textTransform: "uppercase" }}>{data.profile.currentPost || ""}</p>
                        <p style={{ color: "#94a3b8", maxWidth: "500px" }}>{data.profile.bio}</p>
                        <button 
    className="primary-btn" 
    style={{width: 'auto', padding: '10px 20px', marginTop: '10px'}} 
    onClick={async () => {
        try {
            // Updated path to match routes.js exactly
            const res = await api.get(`/user/download_resume?id=${data.profile.userId._id}`);
            
            // The backend returns { message: "filename.pdf" }
            if (res.data.message) {
                window.open(`${API_URL}/${res.data.message}`, '_blank');
            }
        } catch (err) {
            alert("Error generating PDF");
        }
    }}
>
    Download PDF Resume
</button>
                    </div>
                </div>

                <div className="network-grid">
                    <div className="glass-card" style={{width: 'auto', textAlign: 'left'}}>
                        <h3 style={{ color: "#38bdf8" }}>Learning</h3>
                        <p>{data.profile.education || "Ongoing journey..."}</p>
                    </div>
                    <div className="glass-card" style={{width: 'auto', textAlign: 'left'}}>
                        <h3 style={{ color: "#38bdf8" }}>Experience</h3>
                        <p>{data.profile.pastWork || "Previous chapters..."}</p>
                    </div>
                </div>

                <div style={{ marginTop: "30px" }}>
                    <h2 style={{ textAlign: "left", marginBottom: "16px" }}>My Posts</h2>
                    {posts.length === 0 ? (
                        <div className="glass-card" style={{ width: "auto", textAlign: "left" }}>
                            <p style={{ color: "#94a3b8" }}>You have not posted anything yet.</p>
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