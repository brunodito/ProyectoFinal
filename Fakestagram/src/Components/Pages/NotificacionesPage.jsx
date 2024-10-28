import React from 'react';
import '../Styles/NotificacionesPage.css'; // Asegúrate de que la ruta sea correcta

const NotificacionesPage = () => {
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
        </div>
    );
};

export default NotificacionesPage;
