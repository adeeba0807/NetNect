import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useRouter } from "next/router";

import { getAboutUser } from "@/config/redux/action/authAction";
import axios from "@/config/axios";

export default function ProfileUpdate() {
  const dispatch = useDispatch();
  const router = useRouter();

  const authState = useSelector((state) => state.auth);
  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profilePic, setProfilePic] = useState(null);
  const [loading, setLoading] = useState(false);

  // Load user profile on mount
  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else {
      dispatch(getAboutUser({ token }));
    }
  }, []);

  // Populate fields when user is fetched
  useEffect(() => {
    if (authState.user) {
      setName(authState.user.name || "");
      setBio(authState.profile?.bio || "");
    }
  }, [authState.user, authState.profile]);

  // Update name/bio
  const handleProfileInfoUpdate = async () => {
    try {
      setLoading(true);
      await axios.post("/update_profile_data", {
        name,
        bio,
        token,
      });
      alert("Profile updated successfully");
    } catch (err) {
      alert("Failed to update profile: " + err.response?.data?.message);
    } finally {
      setLoading(false);
    }
  };

  // Upload profile picture
  const handleProfilePicUpload = async () => {
    if (!profilePic) return alert("Please select a profile picture");
    try {
      const formData = new FormData();
      formData.append("profile_picture", profilePic);
      formData.append("token", token);
      await axios.post("/update_profile_picture", formData);
      alert("Profile picture updated");
    } catch (err) {
      alert("Failed to upload profile picture: " + err.response?.data?.message);
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2>Update Your Profile</h2>

      <label>Name:</label><br />
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
      /><br /><br />

      <label>Bio / Description:</label><br />
      <textarea
        rows={4}
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      /><br /><br />

      <button onClick={handleProfileInfoUpdate} disabled={loading}>
        {loading ? "Updating..." : "Save Info"}
      </button>

      <hr style={{ margin: "2rem 0" }} />

      <label>Upload Profile Picture:</label><br />
      <input type="file" onChange={(e) => setProfilePic(e.target.files[0])} />
      <button onClick={handleProfilePicUpload}>Upload</button>
    </div>
  );
}
