import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/RegisterPage.css';

const RegisterPage = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleRegister = async () => {
        console.log("Intentando registrar usuario...");
        if (!username || !email || !password) {
            setError('Todos los campos son obligatorios');
            return;
        }

        try {
            const response = await fetch('http://localhost:3001/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ username, email, password }),
            });

            console.log("Respuesta del servidor:", response);

            if (response.ok) {
                const data = await response.json();
                console.log("Usuario registrado:", data);
                localStorage.setItem('token', data.token);
                navigate('/feed'); // Redirigir al feed después de registrarse
            } else {
                const errorData = await response.json();
                console.log("Error de registro:", errorData);
                setError(errorData.message || 'Error en el registro');
            }
        } catch (err) {
            console.error("Error en la comunicación con el servidor:", err);
            setError('Error al comunicarse con el servidor');
        }
    };

    return (
        <div className="register-container">
            <div className="register-box">
                <h2>Crear Cuenta</h2>
                {error && <div className="error-message">{error}</div>}
                <input 
                    type="text" 
                    placeholder="Nombre de usuario" 
                    value={username} 
                    onChange={(e) => setUsername(e.target.value)} 
                />
                <input 
                    type="email" 
                    placeholder="Email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)} 
                />
                <input 
                    type="password" 
                    placeholder="Contraseña" 
                    value={password} 
                    onChange={(e) => setPassword(e.target.value)} 
                />
                <button onClick={handleRegister}>Registrarse</button>
            </div>
        </div>
    );
};

export default RegisterPage;
