import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Importa useNavigate
import '../Styles/SearchPage.css';

const API_BASE_URL = 'http://localhost:3001/api';

const SearchPage = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [loading, setLoading] = useState(false);
    const token = localStorage.getItem('token');
    const navigate = useNavigate(); // Usa useNavigate en lugar de useHistory

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setLoading(true);

        try {
            const response = await fetch(`${API_BASE_URL}/users/search?query=${searchQuery}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Error al buscar usuarios');
            }

            const data = await response.json();

            // Si se encuentra un usuario, redirigir al perfil
            if (data.length > 0) {
                navigate(`/profile/${data[0]._id}`); // Redirige al primer usuario encontrado
            } else {
                alert('No se encontraron usuarios.'); // Puedes manejar esto como desees
            }
        } catch (error) {
            console.error('Error en la búsqueda:', error);
            alert('Error al buscar usuarios. Asegúrate de que el usuario existe.');
        } finally {
            setLoading(false);
        }
    };

    const handleBack = () => {
        navigate('/')
    }

    return (
        <div className="search-container">
            <div className="navigation-bar">
                <div className="nav-item active icon home-icon" onClick={() => navigate('/feed')}></div>
                <div className="nav-item active icon search-icon" onClick={() => navigate('/search')}></div>
                <div className="nav-item active icon create-icon" onClick={() => navigate('/upload')}></div>
                <div className="nav-item active icon notificacion-icon" /*onClick={() => navigate('/')}*/></div>
                <div className="nav-item" onClick={() => navigate('/profile')}>
                    <i className="far fa-user"></i>
                    <span>Perfil</span>
                </div>
            </div>
            <h1>Buscar Usuarios</h1>
            <form onSubmit={handleSearch} className="search-form">
                <input 
                    type="text" 
                    value={searchQuery} 
                    onChange={(e) => setSearchQuery(e.target.value)} 
                    placeholder="Buscar por nombre de usuario..."
                />
                <button type="submit">Buscar</button>
            </form>

            {loading ? (
                <div className="loading">Cargando resultados...</div>
            ) : null}
        </div>
    );
};

export default SearchPage;
