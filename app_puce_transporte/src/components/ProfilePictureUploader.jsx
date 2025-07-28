// src/components/ProfilePictureUploader.jsx
import React, { useState } from 'react';
import './ProfilePictureUploader.css'; // Asegúrate de que este archivo CSS existe y se carga

function ProfilePictureUploader({ userId, currentProfilePic, onUploadSuccess }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(currentProfilePic || null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  const BACKEND_BASE_URL = 'http://localhost:5000';
  const API_UPLOAD_URL = `${BACKEND_BASE_URL}/api/usuarios/${userId}/profile-picture`;
  const API_DELETE_URL = `${BACKEND_BASE_URL}/api/usuarios/${userId}/profile-picture`;

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file));
      setMessage('');
      setError('');
    } else {
      setSelectedFile(null);
      setPreviewUrl(currentProfilePic || null);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setError('Por favor, selecciona una imagen para subir.');
      return;
    }

    setLoading(true);
    setMessage('');
    setError('');

    const formData = new FormData();
    formData.append('profilePicture', selectedFile);

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
      setSelectedFile(null);
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
    } catch (err) {
      console.error('Error al eliminar la foto de perfil:', err);
      setError(`Error al eliminar la foto: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="profile-picture-uploader">
      {/* <h3>Gestionar Foto de Perfil</h3> <-- Esta línea ha sido eliminada */}

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

      <div className="file-input">
        <input type="file" accept="image/*" onChange={handleFileChange} />
      </div>

      <div className="action-buttons">
        <button
          onClick={handleUpload}
          disabled={loading || !selectedFile}
          className={`upload-btn ${loading || !selectedFile ? 'disabled' : ''}`}
        >
          {loading ? 'Subiendo...' : 'Subir/Cambiar Foto'}
        </button>

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
