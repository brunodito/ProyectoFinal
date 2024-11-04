import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        console.log("Iniciando sesión con:", { email, password });

        await onLogin(email, password);
        
        const token = localStorage.getItem('token');
        if (token) {
            console.log("Redirigiendo a /feed");
            navigate('/feed');
        } else {
            alert('Error en el inicio de sesión, verifica tus credenciales');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <div className="home-logo"></div>

                <h2 className="title">Fakestagram</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input 
                        id="email"
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                        className="rectangle"
                    />
                    <label htmlFor="password">Password</label>
                    <input 
                        id="password"
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
                        className="rectangle"
                    />
                    <button type="submit" className="login-button">Login</button>
                </form>
                <button onClick={() => navigate('/register')} className="register-button">
                    Crear cuenta
                </button>
            </div>
        </div>
    );
};

export default LoginPage;
