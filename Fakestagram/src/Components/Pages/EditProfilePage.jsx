import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/EditProfilePage.css';

const API_BASE_URL = 'http://localhost:3001/api';


const EditProfilePage = ({ user }) => {
  const [username, setUsername] = useState(user?.username || '');
  const [profilePicture, setProfilePicture] = useState(user?.profilePicture || '');
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${API_BASE_URL}/user/profile/edit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ username, profilePicture })
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el perfil');
      }

      const data = await response.json();
      console.log('Perfil actualizado:', data.message);
      if (location.state?.refetchUser) {
        location.state.refetchUser();
      }
      navigate('/profile'); 
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  return (
    <div className="edit-profile-page">
      <h1>Editar Perfil</h1>
      <form onSubmit={handleSubmit} className="edit-profile-form">
        <label>
          Nombre de usuario:
          <input 
            type="text" 
            value={username} 
            onChange={(e) => setUsername(e.target.value)} 
          />
        </label>
        <label>
          Foto de perfil (URL):
          <input 
            type="text" 
            value={profilePicture} 
            onChange={(e) => setProfilePicture(e.target.value)} 
          />
        </label>
        <button type="submit" className="save-button">Guardar Cambios</button>
      </form>
      <button onClick={() => navigate('/profile')} className="cancel-button">
        Cancelar
      </button>
    </div>
  );
};

export default EditProfilePage;
