// pages/create-post.jsx

import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { createPost } from "@/config/redux/action/postAction";
import { useRouter } from "next/router";
import UserLayout from "@/layout/UserLayout";

import styles from "@/styles/CreatePostPage.module.css"; // we'll define this next

const CreatePostPage = () => {
  const [content, setContent] = useState("");
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (content.trim()) {
      dispatch(createPost({ content }));
      setContent("");
      router.push("/dashboard"); // return to dashboard after post
    }
  };

  return (
    <UserLayout>
      <div className={styles.container}>
        <div className={styles.card}>
          <h2 className={styles.heading}>Create a New Post</h2>
          <form onSubmit={handleSubmit} className={styles.form}>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className={styles.textarea}
              rows={6}
            />
            <button type="submit" className={styles.button}>
              Post
            </button>
          </form>
        </div>
      </div>
    </UserLayout>
  );
};

export default CreatePostPage;
