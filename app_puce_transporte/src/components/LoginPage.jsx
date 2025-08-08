
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css'; 

export default function LoginPage({
  loginForm,
  handleLoginChange,
  handleLoginSubmit,
  mensaje
}) {
  const navigate = useNavigate();

  return (
    <div className="login-page-container">
      {/* Video de fondo */}
      <video autoPlay muted loop className="video-bg">
        <source src="/bglogin.mp4" type="video/mp4" />
        Tu navegador no soporta videos en HTML5.
      </video>

      {/* Anillos + Formulario */}
      <div className="ring" style={{ '--clr': '#00ffea' }}>
        <i></i>
        <i></i>
        <i></i>

        <div className="login">
          <h2>Iniciar Sesión</h2>

          {mensaje && (
            <div className="mensaje-error">
              {mensaje}
            </div>
          )}

          <form onSubmit={handleLoginSubmit} style={{ width: '100%' }}>
            <div className="inputBx">
              <input
                type="email"
                name="email"
                placeholder="Email"
                value={loginForm.email}
                onChange={handleLoginChange}
                required
              />
            </div>
            <div className="inputBx">
              <input
                type="password"
                name="password"
                placeholder="Contraseña"
                value={loginForm.password}
                onChange={handleLoginChange}
                required
              />
            </div>
            <div className="inputBx">
              <input type="submit" value="Iniciar Sesión" />
            </div>
          </form>

          <div className="links">
            <a href="#" onClick={() => navigate('/')}>Volver</a>
            <a href="#" onClick={() => navigate('/registro')}>Regístrate</a>
          </div>
        </div>
      </div>
    </div>
  );
}
