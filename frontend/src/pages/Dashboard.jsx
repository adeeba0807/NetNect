import { useState, useEffect, useContext } from "react";
import api, { API_URL } from "../api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import CreatePost from "../components/CreatePost";
import UserSuggestions from "../components/UserSuggestions";
import Navbar from "../components/Navbar";

export default function Dashboard() {
    const [posts, setPosts] = useState([]);
    const [searchText, setSearchText] = useState("");
    const [searchResults, setSearchResults] = useState([]);
    const [searching, setSearching] = useState(false);
    // We use an object to store comments: { [postId]: "comment text" }
    const [commentText, setCommentText] = useState({});
    const { token } = useContext(AuthContext);
    const navigate = useNavigate();

    const fetchAllPosts = async () => {
        try {
            const response = await api.get("/posts");
            setPosts(response.data.posts);
        } catch (err) { console.log(err); }
    };

    const handleLike = async (postId) => {
        try {
            await api.post("/increment_post_like", { post_id: postId });
            fetchAllPosts(); 
        } catch (err) { console.error(err); }
    };

    const handleSearchUsers = async () => {
        if (searchText.trim().length < 2) {
            setSearchResults([]);
            return;
        }

        try {
            setSearching(true);
            const response = await api.get(`/search_users?q=${encodeURIComponent(searchText)}&token=${token}`);
            setSearchResults(response.data.users || []);
        } catch (err) {
            console.error(err);
            setSearchResults([]);
        } finally {
            setSearching(false);
        }
    };

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            handleSearchUsers();
        }, 300);

        return () => clearTimeout(timeoutId);
    }, [searchText]);

    // --- NEW COMMENT LOGIC ---
    const handleCommentSubmit = async (postId) => {
    // 1. Get the text from our state object
    const body = commentText[postId];

    // 2. Prevent sending if empty (prevents backend validation errors)
    if (!body || body.trim() === "") {
        alert("Please enter a comment");
        return;
    }

    try {
        console.log("Attempting comment on Post:", postId);
        
        // 3. The request must match your controller's expected keys
        const response = await api.post("/comment", {
            token: token,           // Must be a valid string
            post_id: postId,        // Must be the _id from MongoDB
            commentBody: body       // The actual text
        });

        if (response.status === 200) {
            alert("Comment added!");
            // Clear the input field for this specific post
            setCommentText(prev => ({ ...prev, [postId]: "" }));
            // Refresh posts to see the new comment if your backend sends it
            fetchAllPosts(); 
        }
    } catch (err) {
        console.error("Comment failed details:", err.response?.data);
        alert("Server Error: " + (err.response?.data?.message || "Failed to add comment"));
    }
};

    useEffect(() => { fetchAllPosts(); }, []);

    return (
        <div className="auth-container" style={{ alignItems: 'flex-start', overflowY: 'auto' }}>
            <div className="dashboard-layout">
                
                {/* LEFT SIDEBAR */}
                <div className="sidebar-sticky">
                    <div className="glass-card" style={{ padding: '20px', width: 'auto' }}>
                        <div className="netnect-logo">
                            <span>N</span>
                        </div>
                        <h4 style={{ margin: '15px 0 5px' }}>NetNect Home</h4>
                        <p style={{ color: '#94a3b8', fontSize: '12px' }}>Your professional networking platform.</p>

                        <div style={{ marginTop: '16px', textAlign: 'left' }}>
                            <input
                                className="netnect-input"
                                placeholder="Search users"
                                value={searchText}
                                onChange={(e) => setSearchText(e.target.value)}
                                style={{ marginBottom: '10px' }}
                            />

                            {searching && <p style={{ color: '#94a3b8', fontSize: '12px' }}>Searching...</p>}

                            {!searching && searchResults.map((user) => (
                                <div
                                    key={user._id}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '10px',
                                        padding: '8px 0',
                                        cursor: 'pointer'
                                    }}
                                    onClick={() => navigate(`/profile/${user._id}`)}
                                >
                                    <img
                                        src={`${API_URL}/${user.profilePicture}`}
                                        alt="avatar"
                                        style={{ width: '32px', height: '32px', borderRadius: '50%', objectFit: 'cover' }}
                                    />
                                    <div>
                                        <div style={{ fontSize: '13px', fontWeight: '600' }}>{user.name}</div>
                                        <div style={{ fontSize: '11px', color: '#94a3b8' }}>@{user.username}</div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* CENTER FEED */}
                <div>
                    <CreatePost onPostCreated={fetchAllPosts} />
                    
                    {posts.map((post) => (
                        <div key={post._id} className="post-card">
                            <div style={{ display: "flex", alignItems: "center" }}>
                                <img className="post-user-img" src={`${API_URL}/${post.userId?.profilePicture}`} alt="pfp" />
                                <div>
                                    <strong style={{ display: "block" }}>{post.userId?.name}</strong>
                                    <span style={{ color: "#679ca3ff", fontSize: "12px" }}>@{post.userId?.username}</span>
                                </div>
                            </div>
                            
                            <p style={{ marginTop: '15px', lineHeight: '1.6' }}>{post.body}</p>

                            {post.media && <img className="post-media-img" src={`${API_URL}/${post.media}`} alt="media" />}

                            <div className="interaction-bar">
                                <button className="vibe-btn" onClick={() => handleLike(post._id)}>⚡ {post.likes} Likes</button>
                                {/* <button className="vibe-btn">💬 Discuss</button> */}
                            </div>

                            {/* COMMENT INPUT SECTION */}
                            <div className="comment-wrapper">
                                <input 
                                    className="netnect-input" 
                                    style={{ marginBottom: 0, padding: '10px' }} 
                                    placeholder="Write a comment..." 
                                    value={commentText[post._id] || ""}
                                    onChange={(e) => setCommentText({
                                        ...commentText,
                                        [post._id]: e.target.value
                                    })}
                                />
                                <button 
                                    className="primary-btn comment-btn" 
                                    onClick={() => handleCommentSubmit(post._id)}
                                >
                                    Send
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* RIGHT SIDEBAR */}
                <div className="sidebar-sticky">
                    <UserSuggestions />
                </div>
            </div>

            <Navbar />
        </div>
    );
}