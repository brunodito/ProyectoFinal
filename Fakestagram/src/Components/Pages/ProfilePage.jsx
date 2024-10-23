import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/ProfilePage.css';

const API_BASE_URL = 'http://localhost:3001/api';

const ProfilePage = ({ user }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchUserPosts();
  }, []);

  const fetchUserPosts = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/user/${user._id}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar las publicaciones');
      }

      const data = await response.json();
      setPosts(data);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching posts:', err);
      setLoading(false);
    }
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <header className="profile-header">
        <h1 className="username-title">{user?.username || 'Username'}</h1>
        <div className="header-buttons">
          <button className="icon-button">+</button>
          <button className="icon-button">≡</button>
        </div>
      </header>

      {/* Profile Info */}
      <section className="profile-info">
        <div className="profile-main">
          <img 
            src={user?.profilePicture || '/default-avatar.png'} 
            alt="Profile" 
            className="profile-picture"
          />
          <div className="profile-stats">
            <div className="stat-item">
              <span className="stat-number">{posts.length}</span>
              <span className="stat-label">Posts</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">209</span>
              <span className="stat-label">Friends</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">153</span>
              <span className="stat-label">Following</span>
            </div>
          </div>
        </div>

        <div className="profile-bio">
          <h2 className="bio-username">{user?.username || 'Username'}</h2>
          <p className="bio-text">My profile description</p>
        </div>

        <button 
          onClick={() => navigate('/edit-profile')}
          className="edit-profile-button"
        >
          Edit profile
        </button>
      </section>

      {/* Grid of Posts */}
      <section className="posts-grid">
        {posts.map(post => (
          <div key={post._id} className="post-item">
            <img 
              src={post.imageUrl} 
              alt="Post" 
              className="post-image"
            />
          </div>
        ))}
      </section>

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="nav-buttons">
          <button onClick={() => navigate('/feed')} className="nav-button">
            <i className="fas fa-home"></i>
          </button>
          <button className="nav-button">
            <i className="fas fa-search"></i>
          </button>
          <button onClick={() => navigate('/upload')} className="nav-button">
            <i className="far fa-plus-square"></i>
          </button>
          <button className="nav-button">
            <i className="far fa-heart"></i>
          </button>
          <button className="nav-button">
            <img 
              src={user?.profilePicture || '/default-avatar.png'} 
              alt="Profile" 
              className="nav-profile-pic"
            />
          </button>
        </div>
      </nav>
    </div>
  );
};

export default ProfilePage;