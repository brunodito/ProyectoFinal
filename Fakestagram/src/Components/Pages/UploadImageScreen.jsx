import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/UploadImageScreen.css';

const API_BASE_URL = 'http://localhost:3001/api';

const UploadImageScreen = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (file.size > MAX_FILE_SIZE) {
                setError('El archivo es demasiado grande. El tamaño máximo permitido es de 5 MB.');
                return;
            }
            setSelectedImage(file);
            setError(''); // Limpia el mensaje de error si la imagen es válida
        }
    };

    const handleUpload = async () => {
        if (!selectedImage) {
            setError('Por favor selecciona una imagen');
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage);  // Asegúrate de que 'image' sea el campo esperado por la API
        formData.append('caption', caption);

        try {
            const response = await fetch(`${API_BASE_URL}/posts/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,  // Incluye el token de autenticación
                },
                body: formData,
            });

            // Verificar si el tipo de contenido es JSON
            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text(); // Leer la respuesta como texto
                throw new Error(`Error inesperado: ${text}`);
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al subir la imagen');
            }

            // Resetear los estados después de una carga exitosa
            setSelectedImage(null);
            setCaption('');
            setError('');
            navigate('/feed');  // Navega al feed después de una carga exitosa
        } catch (error) {
            setError(error.message);
            console.error(error);
        }
    };

    return (
        <div className="upload-container">
            <h1>Subir una Imagen</h1>
            {error && <div className="error-message">{error}</div>}

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
            
            <input 
                type="file" 
                accept="image/*" 
                onChange={handleImageChange} 
                className="file-input"
            />
            
            <textarea
                placeholder="Escribe un pie de foto..."
                value={caption}
                onChange={(e) => setCaption(e.target.value)}
                className="caption-input"
            />
            
            {selectedImage && (
                <div className="image-preview">
                    <img 
                        src={URL.createObjectURL(selectedImage)} 
                        alt="Vista previa" 
                        className="preview-image" 
                    />
                </div>
            )}
            
            <button 
                onClick={handleUpload}
                className="upload-button"
            >
                Subir Imagen
            </button>
            
            <button 
                onClick={() => navigate('/feed')}
                className="cancel-button"
            >
                Cancelar
            </button>
        </div>
    );
};

export default UploadImageScreen;
