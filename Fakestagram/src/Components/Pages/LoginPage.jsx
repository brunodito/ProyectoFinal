import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/LoginPage.css';

const LoginPage = ({ onLogin }) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault(); // Evitar que la página se recargue
        console.log("Iniciando sesión con:", { email, password });

        // Llamar a la función onLogin pasada como prop
        await onLogin(email, password);
        
        // Verificar si el token se estableció en el almacenamiento local
        const token = localStorage.getItem('token');
        if (token) {
            console.log("Redirigiendo a /feed");
            navigate('/feed'); // Redirigir al feed
        } else {
            alert('Error en el inicio de sesión, verifica tus credenciales');
        }
    };

    return (
        <div className="login-container">
            <div className="login-box">
                <h2 className="title">Login</h2>
                <form onSubmit={handleSubmit}>
                    <label htmlFor="email">Email</label>
                    <input 
                        id="email"
                        type="email" 
                        placeholder="Email" 
                        value={email} 
                        onChange={(e) => setEmail(e.target.value)} 
                    />
                    <label htmlFor="password">Password</label>
                    <input 
                        id="password"
                        type="password" 
                        placeholder="Password" 
                        value={password} 
                        onChange={(e) => setPassword(e.target.value)} 
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
