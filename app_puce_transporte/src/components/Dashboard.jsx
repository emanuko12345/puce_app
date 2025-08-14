// src/components/Dashboard.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';
import ProfilePictureUploader from './ProfilePictureUploader.jsx';

function Dashboard({ usuarioLogeado, handleLogout, updateUsuarioLogeadoProfilePic }) {
  const [profileImageUrl, setProfileImageUrl] = useState(usuarioLogeado?.foto_perfil_url || null);

  useEffect(() => {
    setProfileImageUrl(usuarioLogeado?.foto_perfil_url || null);
  }, [usuarioLogeado?.foto_perfil_url]);

  const handleProfileUploadSuccess = (newImageUrl) => {
    setProfileImageUrl(newImageUrl);
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
      </div>

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

          {/* Solo se mostrará si el rol es 'estudiante' o 'conductor' */}
          {(usuarioLogeado.rol === 'estudiante' || usuarioLogeado.rol === 'conductor') && (
            <li>
              <Link to="/reserva" className="nav-link indigo">
                Realizar Reserva
              </Link>
            </li>
          )}

          {/* ¡CAMBIO AQUÍ! Solo se mostrará si el rol es 'admin' */}
          {usuarioLogeado.rol === 'admin' && (
             <li>
               <Link to="/reservas" className="nav-link green">
                 Ver Mis Reservas
               </Link>
             </li>
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