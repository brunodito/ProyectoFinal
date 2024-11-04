import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import LoginPage from './Components/Pages/LoginPage';
import FeedPage from './Components/Pages/FeedPage';
import ProfilePage from './Components/Pages/ProfilePage';
import UploadImageScreen from './Components/Pages/UploadImageScreen';
import RegisterPage from './Components/Pages/RegisterPage';
import SearchPage from './Components/Pages/SearchPage'; 
import EditProfilePage from './Components/Pages/EditProfilePage'; 
import SettingsPage from './Components/Pages/SettingsPage'; 
import NotificacionesPage from './Components/Pages/NotificacionesPage';
import './app.css';

const API_BASE_URL = 'http://localhost:3001/api';

const App = () => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);

    const handleLogin = async (email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            if (!response.ok) {
                throw new Error('Credenciales incorrectas');
            }

            const data = await response.json();
            setUser(data);
            setIsAuthenticated(true);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data._id);
            return true;
        } catch (error) {
            console.error('Error durante la autenticación:', error);
            return false;
        }
    };

    const handleRegister = async (username, email, password) => {
        try {
            const response = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error en el registro');
            }

            const data = await response.json();
            setUser(data);
            setIsAuthenticated(true);
            localStorage.setItem('token', data.token);
            localStorage.setItem('userId', data._id);
            return true;
        } catch (error) {
            console.error('Error durante el registro:', error);
            return false;
        }
    };

    const handleLogout = () => {
        setIsAuthenticated(false);
        setUser(null);
        localStorage.removeItem('token');
        localStorage.removeItem('userId');
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const userId = localStorage.getItem('userId');
        
        if (token && userId) {
            fetch(`${API_BASE_URL}/users/${userId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Token inválido');
            })
            .then(userData => {
                setUser(userData);
                setIsAuthenticated(true);
            })
            .catch(() => {
                handleLogout();
            });
        }
    }, []);

    return (
        <Router>
            <div className="app-container">
           
                <Routes>
                    {/* Rutas existentes */}
                    <Route path="/" element={!isAuthenticated ? <LoginPage onLogin={handleLogin} /> : <Navigate to="/feed" />} />
                    <Route path="/register" element={!isAuthenticated ? <RegisterPage onRegister={handleRegister} /> : <Navigate to="/feed" />} />
                    <Route path="/feed" element={isAuthenticated ? <FeedPage user={user} /> : <Navigate to="/" />} />
                    <Route path="/profile" element={isAuthenticated ? <ProfilePage user={user} /> : <Navigate to="/" />} />
                    <Route path="/upload" element={isAuthenticated ? <UploadImageScreen user={user} /> : <Navigate to="/" />} />
                    <Route path="/search" element={isAuthenticated ? <SearchPage /> : <Navigate to="/" />} />
                    
                    {/* Nuevas rutas */}
                    <Route path="/edit-profile" element={isAuthenticated ? <EditProfilePage /> : <Navigate to="/" />} />
                    <Route path="/settings" element={isAuthenticated ? <SettingsPage /> : <Navigate to="/" />} />
                    <Route path="/notifications" element={isAuthenticated ? <NotificacionesPage /> : <Navigate to="/" />} />
                </Routes>
            </div>
        </Router>
    );
};

export default App;
