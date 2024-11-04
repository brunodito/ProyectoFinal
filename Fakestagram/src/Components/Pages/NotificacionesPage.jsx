import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/NotificacionesPage.css'; // Asegúrate de que la ruta sea correcta

const NotificacionesPage = () => {

    const navigate = useNavigate();
    const notifications = [
        {
            id: 1,
            type: 'comment',
            message: 'Emilia comentó en tu publicación: "¡Me encanta esta foto!"',
            time: 'Hace 5 minutos'
        },
        {
            id: 2,
            type: 'like',
            message: 'Juan le dio like a tu publicación.',
            time: 'Hace 15 minutos'
        },
        {
            id: 3,
            type: 'followed-post',
            message: 'Ana, a quien sigues, subió una nueva publicación.',
            time: 'Hace 1 hora'
        }
    ];

    return (
        <div className="notifications-container">
            <h1>Notificaciones</h1>
            <div className="notifications-list">
                {notifications.map(notification => (
                    <div key={notification.id} className={`notification-item ${notification.type}`}>
                        <div className="icon"></div>
                        <div className="notification-content">
                            <p>{notification.message}</p>
                            <span className="time">{notification.time}</span>
                        </div>
                    </div>
                ))}
            </div>

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
};

export default NotificacionesPage;
