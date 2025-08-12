// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import ProfilePictureUploader from './ProfilePictureUploader.jsx';

function Dashboard({ usuarioLogeado, handleLogout, updateUsuarioLogeadoProfilePic }) {
  // Estado para la URL de la foto de perfil. Inicializa con la que viene del usuarioLogeado
  const [profileImageUrl, setProfileImageUrl] = useState(usuarioLogeado?.foto_perfil_url || null);

  // Efecto para actualizar profileImageUrl cuando usuarioLogeado.foto_perfil_url cambie
  useEffect(() => {
    setProfileImageUrl(usuarioLogeado?.foto_perfil_url || null);
  }, [usuarioLogeado?.foto_perfil_url]); // Se ejecuta cuando la URL de la foto de perfil del usuario logeado cambia

  // Callback para actualizar la URL de la foto de perfil después de una subida exitosa
  const handleProfileUploadSuccess = (newImageUrl) => {
    setProfileImageUrl(newImageUrl);
    // Llama a la función pasada desde App.jsx para actualizar el estado global
    updateUsuarioLogeadoProfilePic(newImageUrl);
  };

  if (!usuarioLogeado) {
    return <p>Por favor, inicia sesión para ver el Dashboard.</p>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Hola Bienvenido, {usuarioLogeado.nombre}!
      </h1>

      <div className="session-info">
        
        {/* Se ha eliminado la visualización de la foto de perfil de esta sección */}
        
      </div>

      {/* Incluye el componente ProfilePictureUploader, que es donde se gestiona y visualiza la foto */}
      {usuarioLogeado && (
        <ProfilePictureUploader
          userId={usuarioLogeado.id}
          currentProfilePic={profileImageUrl}
          onUploadSuccess={handleProfileUploadSuccess}
        />
      )}

      <nav>
        <ul className="nav-list">
          {/* Se mostrará siempre */}
          <li>
            <Link to="/horarios" className="nav-link">
              Ver Horarios
            </Link>
          </li>
          {/* Solo se mostrará si el rol no es 'admin' o 'conductor' */}
          {usuarioLogeado.rol === 'estudiante' && (
            <>
              <li>
                <Link to="/reserva" className="nav-link indigo">
                  Realizar Reserva
                </Link>
              </li>
              <li>
                <Link to="/reservas" className="nav-link green">
                  Ver Mis Reservas
                </Link>
              </li>
            </>
          )}
          {/* Solo se mostrará si el rol es 'admin' */}
          {usuarioLogeado.rol === 'admin' && (
            <li>
              <Link to="/usuarios-registrados" className="nav-link orange">
                Ver Usuarios Registrados
              </Link>
            </li>
          )}
          {/* Solo se mostrará si el rol es 'conductor' */}
          {usuarioLogeado.rol === 'conductor' && (
            <li>
              <Link to="/crear-viaje" className="nav-link yellow">
                Registrar Viaje 
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="system-info">
      
        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Cerrar Sesión
        </button>


      </div>
    </div>
  );
}

export default Dashboard;