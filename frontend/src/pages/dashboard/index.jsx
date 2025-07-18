import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSelector, useDispatch } from 'react-redux';

import DashboardLayout from '@/layout/DashboardLayout';
import UserLayout from '@/layout/UserLayout';

import { getAllPosts } from '@/config/redux/action/postAction';
import { getAboutUser } from '@/config/redux/action/authAction';

//import ProfileSection from '@/components/ProfileSection';
//import UserSearch from '@/Components/UserSearch';
//import ConnectionRequests from '@/Components/ConnectionRequests';

import PostFeed from '@/Components/PostFeed';

import styles from './dashboard.module.css';
import Link from "next/link";
export default function Dash() {
  const router = useRouter();
  const dispatch = useDispatch();
  const authState = useSelector((state) => state.auth);
  const [activeTab, setActiveTab] = useState('posts');
  const [isTokenThere, setIsTokenThere] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
    } else {
      setIsTokenThere(true);
    }
  }, []);

  useEffect(() => {
    if (isTokenThere) {
      dispatch(getAllPosts());
      dispatch(getAboutUser({ token: localStorage.getItem('token') }));
    }
  }, [isTokenThere]);

  if (!isTokenThere) return null;

  const handleUpdateProfile = (data) => {
    console.log("Profile update:", data);
  };

  return (
    <UserLayout>
      <DashboardLayout>
        <div className={styles.dashboardContainer}>
          <aside className={styles.sidebar}>
            <button className={activeTab === 'posts' ? 'active' : ''} onClick={() => setActiveTab('posts')}>📢 Post Feed</button>
            <button className={activeTab === 'create' ? 'active' : ''} onClick={() => setActiveTab('create')}>📝 Create Post</button>
            <button className={activeTab === 'profile' ? 'active' : ''} onClick={() => setActiveTab('profile')}>👤 Profile</button>
            <button className={activeTab === 'connections' ? 'active' : ''} onClick={() => setActiveTab('connections')}>🔗 Connections</button>
            <button className={activeTab === 'search' ? 'active' : ''} onClick={() => setActiveTab('search')}>🔍 Search People</button>
          </aside>

          <main className={styles.mainPanel}>
            <div className={styles.header}>Welcome</div>
            <p>Hello, <strong>{authState?.user?.name || 'Loading...'}</strong></p>

           {activeTab === 'profile' && (
  <Link href="/edit-profile">
    <button className={styles.navButton}>Go to Edit Profile</button>
  </Link>
)}

            {activeTab === 'connections' && (
             <Link href="/connections">
  <button className={activeTab === 'connections' ? 'active' : ''}>
    🔗 Connections
  </button>
</Link>

            )}

            {activeTab === 'search' && (
             <Link href="/search-people">
  <button className={activeTab === 'search' ? 'active' : ''}>
    🔍 Search People
  </button>
</Link>

            )}

            {activeTab === 'create' && (
              <div className={styles.section}>
               
<Link href="/create-post">
  <button
    style={{
      backgroundColor: "#d62c0ed4",
      color: "white",
      padding: "10px 20px",
      borderRadius: "8px",
      border: "none",
      marginTop: "1rem",
      cursor: "pointer",
      fontWeight: "bold"
    }}
  >
    + Create New Post
  </button>
</Link>
              </div>
            )}

            {activeTab === 'posts' && (
              <div className={styles.section}>
                <PostFeed />
              </div>
            )}
          </main>
        </div>
      </DashboardLayout>
    </UserLayout>
  );
}
