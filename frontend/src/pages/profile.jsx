import React, { useState } from "react";
import styles from "./Profile.module.css";

const ProfileSection = ({ user, onUpdateProfile }) => {
  const [editing, setEditing] = useState(false);
  const [bio, setBio] = useState(user?.bio || "");
  const [location, setLocation] = useState(user?.location || "");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onUpdateProfile) {
      onUpdateProfile({ bio, location });
    }
    setEditing(false);
  };

  return (
    <div className={styles.container}>
      <h2 className={styles.header}>My Profile</h2>

      {!editing ? (
        <div className={styles.infoBox}>
          <p><strong>Name:</strong> {user?.name || "N/A"}</p>
          <p><strong>Email:</strong> {user?.email || "N/A"}</p>
          <p><strong>Bio:</strong> {user?.bio || "No bio added"}</p>
          <p><strong>Location:</strong> {user?.location || "Not set"}</p>
          <button className={styles.editBtn} onClick={() => setEditing(true)}>Edit Profile</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Bio:</label>
            <input
              type="text"
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              className={styles.input}
              placeholder="Tell us about yourself"
            />
          </div>
          <div className={styles.formGroup}>
            <label className={styles.label}>Location:</label>
            <input
              type="text"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className={styles.input}
              placeholder="Your location"
            />
          </div>
          <div className={styles.buttonGroup}>
            <button type="submit" className={styles.updateBtn}>Update</button>
            <button type="button" onClick={() => setEditing(false)} className={styles.cancelBtn}>
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default ProfileSection;
