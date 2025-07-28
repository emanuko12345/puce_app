// src/components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import './Dashboard.css';

function Dashboard({ usuarioLogeado, handleLogout }) {
  if (!usuarioLogeado) {
    return <p>Por favor, inicia sesión para ver el Dashboard.</p>;
  }

  return (
    <div className="dashboard-container">
      <h1 className="dashboard-title">
        Bienvenido, {usuarioLogeado.nombre}!
      </h1>

      <div className="session-info">
        <h2>Sesión Iniciada</h2>
        <p>Usuario: {usuarioLogeado.nombre} {usuarioLogeado.apellido} ({usuarioLogeado.email})</p>
        <p>Rol: {usuarioLogeado.rol}</p>
        <button
          onClick={handleLogout}
          className="logout-button"
        >
          Cerrar Sesión
        </button>
      </div>

      <nav>
        <ul className="nav-list">
          <li>
            <Link to="/horarios" className="nav-link">
              Ver Horarios
            </Link>
          </li>
          <li>
            <Link to="/reserva" className="nav-link indigo">
              Realizar Reserva
            </Link>
          </li>
          {/* NUEVO: Enlace para ver las reservas */}
          <li>
            <Link to="/reservas" className="nav-link green"> {/* Puedes ajustar la clase CSS si tienes una específica para este */}
              Ver Mis Reservas
            </Link>
          </li>
          {/* FIN NUEVO */}
          {usuarioLogeado.rol === 'admin' && (
            <li>
              <Link to="/usuarios-registrados" className="nav-link orange">
                Ver Usuarios Registrados
              </Link>
            </li>
          )}
          {usuarioLogeado.rol === 'conductor' && (
            <li>
              <Link to="/mis-rutas" className="nav-link yellow">
                Mis Rutas
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="system-info">
        <h2>Información del Sistema</h2>
        <p>Desde aquí puedes navegar a las diferentes funcionalidades de la aplicación de transporte de la PUCE.</p>
      </div>
    </div>
  );
}

export default Dashboard;
