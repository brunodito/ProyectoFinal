import React from 'react';
import '../Styles/SettingsPage.css';

const SettingsPage = () => {
  return (
    <div className="settings-page">
      <h1>Configuración y Preferencias</h1>
      <ul className="settings-options">
        <li className="settings-item">Notificaciones</li>
        <li className="settings-item">Privacidad</li>
        <li className="settings-item">Cuenta</li>
        <li className="settings-item">Seguridad</li>
        {/* Puedes agregar más opciones según tus necesidades */}
      </ul>
    </div>
  );
};

export default SettingsPage;
