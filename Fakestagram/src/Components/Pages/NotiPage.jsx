import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/NotiPage.css';

const API_BASE_URL = 'http://localhost:3001/api';

const NotiPage = ({ user }) => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/posts/notificaciones`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Error al cargar las notificaciones');
      }

      const data = await response.json();
      setNotifications(data);
      setLoading(false);
    } catch (err) {
      setError('Error al cargar las notificaciones');
      setLoading(false);
    }
  };

  if (loading) return <div className="loading">Cargando notificaciones...</div>;
  if (error) return <div className="error">{error}</div>;

  return (
    <div className="noti-container">
      <header className="noti-header">
        <h1>Notificaciones</h1>
      </header>
      
      {notifications.length === 0 ? (
        <div className="empty-notifications">
          <p>No tienes nuevas notificaciones.</p>
        </div>
      ) : (
        <div className="notifications-list">
          {notifications.map(notification => (
            <div key={notification._id} className="notification-item">
              <img 
                src={notification.user.profilePicture || '/default-avatar.png'} 
                alt={notification.user.username} 
                className="notification-avatar"
              />
              <div className="notification-info">
                <span className="notification-text">
                  <strong>{notification.user.username}</strong> {notification.action}
                </span>
                <span className="notification-timestamp">{notification.timestamp}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className="bottom-nav">
        <div className="navigation-bar">
          <div className="nav-item active" onClick={() => navigate('/feed')}>
            <i className="fas fa-home"></i>
            <span>Inicio</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/search')}>
            <i className="fas fa-search"></i>
            <span>Buscar</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/upload')}>
            <i className="far fa-plus-square"></i>
            <span>Crear</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/notificaciones')}>
            <i className="far fa-heart"></i>
            <span>Notificaciones</span>
          </div>
          <div className="nav-item" onClick={() => navigate('/profile')}>
            <i className="far fa-user"></i>
            <span>Perfil</span>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default NotiPage;
