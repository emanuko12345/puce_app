import React from 'react';
import './AuthPage.css';

function AuthPage({
  registroForm, handleRegistroChange, handleRegistroSubmit,
  loginForm, handleLoginChange, handleLoginSubmit,
  mensaje
}) {
  return (
    <div className="auth-container">
      <h1 className="auth-title">PUCE Transport App</h1>

      {mensaje && (
        <div className="auth-message" role="alert">
          <span>{mensaje}</span>
        </div>
      )}

      <h2 className="auth-section-title">Registro de Usuario</h2>
      <form onSubmit={handleRegistroSubmit} className="auth-form auth-grid">
        <div>
          <label htmlFor="registro-nombre">Nombre:</label>
          <input
            type="text"
            id="registro-nombre"
            name="nombre"
            className="auth-input"
            value={registroForm.nombre}
            onChange={handleRegistroChange}
            required
          />
        </div>
        <div>
          <label htmlFor="registro-apellido">Apellido:</label>
          <input
            type="text"
            id="registro-apellido"
            name="apellido"
            className="auth-input"
            value={registroForm.apellido}
            onChange={handleRegistroChange}
            required
          />
        </div>
        <div>
          <label htmlFor="registro-email">Email:</label>
          <input
            type="email"
            id="registro-email"
            name="email"
            className="auth-input"
            value={registroForm.email}
            onChange={handleRegistroChange}
            required
          />
        </div>
        <div>
          <label htmlFor="registro-contrasena">Contraseña:</label>
          <input
            type="password"
            id="registro-contrasena"
            name="contrasena"
            className="auth-input"
            value={registroForm.contrasena}
            onChange={handleRegistroChange}
            required
          />
        </div>
        <div>
          <label htmlFor="registro-rol">Rol:</label>
          <select
            id="registro-rol"
            name="rol"
            className="auth-input"
            value={registroForm.rol}
            onChange={handleRegistroChange}
          >
            <option value="estudiante">Estudiante</option>
            <option value="conductor">Conductor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label htmlFor="registro-telefono">Teléfono (Opcional):</label>
          <input
            type="text"
            id="registro-telefono"
            name="telefono"
            className="auth-input"
            value={registroForm.telefono}
            onChange={handleRegistroChange}
          />
        </div>
        <div className="md:col-span-2">
          <button type="submit" className="auth-button">
            Registrar Usuario
          </button>
        </div>
      </form>

      <h2 className="auth-section-title">Inicio de Sesión</h2>
      <form onSubmit={handleLoginSubmit} className="auth-form">
        <div>
          <label htmlFor="login-email">Email:</label>
          <input
            type="email"
            id="login-email"
            name="email"
            className="auth-input"
            value={loginForm.email}
            onChange={handleLoginChange}
            required
          />
        </div>
        <div>
          <label htmlFor="login-contrasena">Contraseña:</label>
          <input
            type="password"
            id="login-contrasena"
            name="contrasena"
            className="auth-input"
            value={loginForm.contrasena}
            onChange={handleLoginChange}
            required
          />
        </div>
        <button type="submit" className="auth-button login-button">
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default AuthPage;
