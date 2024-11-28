import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/UploadImageScreen.css';

const API_BASE_URL = 'http://localhost:3001/api';

const UploadImageScreen = () => {
    const [selectedImage, setSelectedImage] = useState(null);
    const [caption, setCaption] = useState('');
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false); // Estado para la carga
    const navigate = useNavigate();
    const token = localStorage.getItem('token');

    const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 MB
    const MAX_CAPTION_LENGTH = 100; // Longitud máxima para el pie de foto

    const handleImageChange = (event) => {
        const file = event.target.files[0];
        if (file) {
            // Verificación del tipo de archivo
            if (!file.type.startsWith('image/')) {
                setError('Por favor selecciona un archivo de imagen válido.');
                return;
            }
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

        if (caption.length > MAX_CAPTION_LENGTH) {
            setError(`El pie de foto no puede exceder los ${MAX_CAPTION_LENGTH} caracteres.`);
            return;
        }

        const formData = new FormData();
        formData.append('image', selectedImage); 
        formData.append('caption', caption);

        setIsLoading(true); // Inicia el estado de carga

        try {
            const response = await fetch(`${API_BASE_URL}/posts/upload`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
                body: formData,
            });

            const contentType = response.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const text = await response.text();
                throw new Error(`Error inesperado: ${text}`);
            }

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Error al subir la imagen');
            }

            setSelectedImage(null);
            setCaption('');
            setError('');
            setIsLoading(false); // Termina el estado de carga
            navigate('/feed');  
        } catch (error) {
            setError(error.message);
            setIsLoading(false); // Termina el estado de carga en caso de error
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
                <div className="nav-item active icon notificacion-icon" onClick={() => navigate('/notifications')}></div>
                <div className="nav-item active icon profile-icon" onClick={() => navigate('/profile')}></div>
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
                maxLength={MAX_CAPTION_LENGTH} // Límite de caracteres
                className="caption-input"
            />
            
            {selectedImage && (
                <div className="image-preview">
                    <img 
                        src={URL.createObjectURL(selectedImage)} 
                        alt="Vista previa" 
                        className="image" 
                    />
                </div>
            )}

            {/* Botón de carga con indicador de estado */}
            <button 
                onClick={handleUpload}
                className="upload-button"
                disabled={isLoading} // Desactiva el botón si está cargando
            >
                {isLoading ? 'Subiendo...' : 'Subir Imagen'}
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