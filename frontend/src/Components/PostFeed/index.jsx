import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { likePost, commentPost } from "@/config/redux/action/postAction";

const PostFeed = () => {
  const posts = useSelector((state) => state.post?.posts || []);
  const dispatch = useDispatch();
  const [commentText, setCommentText] = useState({});

  const handleLike = (postId) => {
    dispatch(likePost(postId));
  };

  const handleComment = (postId) => {
    if (commentText[postId]?.trim()) {
      dispatch(commentPost({ postId, comment: commentText[postId] }));
      setCommentText({ ...commentText, [postId]: "" });
    }
  };

  return (
    <div>
      <h3>Posts</h3>
      {posts.map((post) => (
        <div key={post._id} style={{ border: "1px solid #ccc", marginBottom: "1rem", padding: "1rem" }}>
          <p>{post.content}</p>
          <button onClick={() => handleLike(post._id)}>
            Like ({post.likes?.length || 0})
          </button>
          <div>
            <input
              type="text"
              value={commentText[post._id] || ""}
              onChange={(e) => setCommentText({ ...commentText, [post._id]: e.target.value })}
              placeholder="Add a comment..."
            />
            <button onClick={() => handleComment(post._id)}>Comment</button>
          </div>
          <ul>
            {post.comments?.map((c, idx) => (
              <li key={idx}>{c.text} - {c.user?.name}</li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
};

export default PostFeed;