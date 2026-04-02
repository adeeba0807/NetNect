import { useState, useContext } from "react";
import api from "../api";
import { AuthContext } from "../context/AuthContext";

export default function CreatePost({ onPostCreated }) {
    const [body, setBody] = useState("");
    const [file, setFile] = useState(null);
    const { token } = useContext(AuthContext);

    const handlePost = async () => {
        if (!body) return alert("Please add some text to your post!");

        const formData = new FormData();
        formData.append("body", body); 
        formData.append("token", token);
        
        if (file) {
            formData.append("media", file);
        }

        try {
            await api.post("/post", formData, {
                headers: { "Content-Type": "multipart/form-data" }
            });
            alert("Post Shared to NetNect!");
            setBody("");
            setFile(null);
            onPostCreated(); 
        } catch (err) {
            console.error(err);
        }
    };

    return (
        /* Using glass-card for the main container */
        <div className="glass-card" style={{ width: 'auto', textAlign: 'left', padding: '25px', marginBottom: '30px' }}>
            <h4 style={{ margin: '0 0 15px 0', color: 'var(--accent-cyan)', fontSize: '1.1rem' }}>
                Create a Post
            </h4>
            
            <textarea 
                className="netnect-input"
                placeholder="What's your latest project?" 
                value={body}
                onChange={(e) => setBody(e.target.value)}
                style={{ minHeight: '100px', resize: 'none' }}
            />
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '10px' }}>
                {/* Hidden real input, styled label acting as a button */}
                <label style={{ 
                    cursor: 'pointer', 
                    color: 'var(--text-dim)', 
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                }}>
                    <input 
                        type="file" 
                        style={{ display: 'none' }} 
                        onChange={(e) => setFile(e.target.files[0])} 
                    />
                    <span style={{ fontSize: '1.2rem' }}>🖼️</span> 
                    {file ? <span style={{color: 'var(--accent-cyan)'}}>{file.name}</span> : "Add Media"}
                </label>

                <button 
                    className="primary-btn" 
                    onClick={handlePost}
                    style={{ width: '100px', padding: '10px', marginTop: 0 }}
                >
                    POST 
                </button>
            </div>
        </div>
    );
}