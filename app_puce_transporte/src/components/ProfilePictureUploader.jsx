// src/components/ProfilePictureUploader.jsx
import React, { useState, useRef } from 'react';
import './ProfilePictureUploader.css';

function ProfilePictureUploader({ userId, currentProfilePic, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentProfilePic || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Crea una referencia para el input de archivo oculto
  const fileInputRef = useRef(null);

  const BACKEND_BASE_URL = 'http://localhost:5000';
  const API_UPLOAD_URL = `${BACKEND_BASE_URL}/api/usuarios/${userId}/profile-picture`;
  const API_DELETE_URL = `${BACKEND_BASE_URL}/api/usuarios/${userId}/profile-picture`;

  // Modificada para iniciar la subida automáticamente después de la selección
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file); // Guarda el archivo seleccionado en el estado
      setPreviewUrl(URL.createObjectURL(file)); // Muestra previsualización
      setMessage('');
      setError('');
      handleUpload(file); // <--- Llama a handleUpload inmediatamente con el archivo
    } else {
      setSelectedFile(null);
      setPreviewUrl(currentProfilePic || null);
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Resetea el input si no se selecciona nada
      }
    }
  };

  // Modificada para aceptar un archivo directamente o usar el del estado
  const handleUpload = async (fileToUpload = selectedFile) => {
    if (!fileToUpload) {
      setError('Por favor, selecciona una imagen para subir.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('profilePicture', fileToUpload); // Usa fileToUpload

    try {
      const response = await fetch(API_UPLOAD_URL, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al subir la imagen.');
      }

      setMessage('Foto de perfil subida exitosamente!');
      if (onUploadSuccess) {
        onUploadSuccess(data.profilePictureUrl);
      }
      setPreviewUrl(`${BACKEND_BASE_URL}${data.profilePictureUrl}`);
      setSelectedFile(null); // Limpia el archivo seleccionado después de la subida
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Resetea el input de archivo
      }
    } catch (err) {
      console.error('Error al subir la foto de perfil:', err);
      setError(`Error al subir la foto: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!previewUrl) {
      setError('No hay foto de perfil para eliminar.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    try {
      const response = await fetch(API_DELETE_URL, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Error al eliminar la imagen.');
      }

      setMessage('Foto de perfil eliminada exitosamente!');
      setPreviewUrl(null);
      if (onUploadSuccess) {
        onUploadSuccess(null);
      }
      setSelectedFile(null); // Limpia el archivo seleccionado
      if (fileInputRef.current) {
        fileInputRef.current.value = ''; // Resetea el input de archivo
      }
    } catch (err) {
      console.error('Error al eliminar la foto de perfil:', err);
      setError(`Error al eliminar la foto: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Función para activar el input de archivo oculto (ahora llamada por el botón "Subir")
  const handleUploadButtonClick = () => {
    fileInputRef.current.click();
  };

  return (
    <div className="profile-picture-uploader">
      <div className="image-preview">
        {previewUrl ? (
          <img
            src={previewUrl.startsWith('blob:') ? previewUrl : `${BACKEND_BASE_URL}${previewUrl}`}
            alt="Previsualización de perfil"
            className="preview-image"
          />
        ) : (
          <div className="no-image">No hay imagen</div>
        )}
      </div>

      {/* Input de archivo real, oculto visualmente */}
      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        ref={fileInputRef} // Asigna la referencia
        style={{ display: 'none' }} // Oculta el input nativo
      />

      <div className="action-buttons">
        {/* Botón "Subir/Cambiar Foto" que ahora activa la selección y subida */}
        <button
          onClick={handleUploadButtonClick} // Llama a la función que activa el input de archivo
          disabled={loading} // Solo se deshabilita durante la carga
          className={`upload-btn ${loading ? 'disabled' : ''}`}
        >
          {loading ? 'Subiendo...' : 'Subir/Cambiar Foto'}
        </button>

        {/* Botón de eliminar, solo visible si hay una foto */}
        {previewUrl && (
          <button
            onClick={handleDelete}
            disabled={loading}
            className={`delete-btn ${loading ? 'disabled' : ''}`}
          >
            {loading ? 'Eliminando...' : 'Eliminar Foto'}
          </button>
        )}
      </div>

      {message && <p className="status-message success">{message}</p>}
      {error && <p className="status-message error">{error}</p>}
    </div>
  );
}

export default ProfilePictureUploader;