import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/ProfilePage.css';

const API_BASE_URL = 'http://localhost:3001/api/user/profile';

export function ProfilePage({ user }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');
  const userId = String(user._id)
  
  useEffect(() => {
    console.log(userId);
    const fetchUserPosts = async () => {
      if (!token) {
        console.error("No hay token");
        return;
      }
      try {
        const response = await fetch(`${API_BASE_URL}/${userId}`, {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error('Error al cargar las publicaciones');
        }

        const data = await response.json();
        console.log('Datos recibidos de la API:', data); // Verifica que la respuesta sea correcta

        // Verifica que los datos tengan la propiedad "posts" y que sea un array
        if (data && Array.isArray(data.posts)) {
          setPosts(data.posts); // Establece las publicaciones
        } else {
          console.error('Los datos no contienen un array en la propiedad "posts"');
          setPosts([]); // Si no hay publicaciones, establece un array vacío
        }

        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchUserPosts();
  }, [userId, token]);

  const openPostModal = (post) => {
    setSelectedPost(post); // Establece la publicación seleccionada
  };

  const closePostModal = () => {
    setSelectedPost(null); // Cierra el modal
  };

  return (
    <div className="profile-page">
      {/* Header */}
      <header className="profile-header">
        <h1 className="username-title">{user?.username || 'Username'}</h1>
        <div className="header-buttons">
          <button className="icon-button" onClick={() => navigate('/upload')}>+</button>
          <button className="icon-button" onClick={() => navigate('/settings')}>≡</button>
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

      {selectedPost && (
        <div className="modal-overlay" onClick={closePostModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <button className="close-button" onClick={closePostModal}>X</button>
            <img
              src={`http://localhost:3001/${selectedPost.imageUrl}`}
              alt="Post"
              className="image"
            />
            <div className="modal-details">
              <h2>{selectedPost.caption}</h2>
              <p>Likes: {selectedPost.likes}</p>
              <div className="comments-section">
                <h3>Comments</h3>
                {selectedPost.comments?.map((comment, index) => (
                  <p key={index}>{comment}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grid of Posts */}
      {!selectedPost && (
      <section className="posts-grid">
        {posts.map(post => (
          <div key={post._id} className="post-item">
            <img 
              src={`http://localhost:3001/${post.imageUrl}`}
              alt="Post" 
              className="imagenGreed"
              onClick={() => openPostModal(post)}
            />
          </div>
        ))}
      </section>
      )};

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="navigation-bar">
          <div className="nav-item active icon home-icon" onClick={() => navigate('/feed')}></div>
          <div className="nav-item active icon search-icon" onClick={() => navigate('/search')}></div>
          <div className="nav-item active icon create-icon" onClick={() => navigate('/upload')}></div>
          <div className="nav-item active icon notificacion-icon" onClick={() => navigate('/notifications')}></div>
          <div className="nav-item active icon profile-icon" onClick={() => navigate('/profile')}></div>
        </div>
      </nav>
    </div>
  );
}

export default ProfilePage;
