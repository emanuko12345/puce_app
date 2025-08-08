import React, { useEffect, useState } from 'react';
import './RegistroAnimado.css';

export default function RegistroAnimado({
  registroForm,
  handleRegistroChange,
  handleRegistroSubmit,
  mensaje
}) {
  const [rolSeleccionado, setRolSeleccionado] = useState(registroForm.rol || 'estudiante');
  const [abierto, setAbierto] = useState(false);

  // Evitar que el fondo global de AuthPage.css se aplique aquí
  useEffect(() => {
    document.body.classList.remove('auth-page-background');
    return () => {
      // no hacemos nada al desmontar; AuthPage añadirá su clase cuando se monte
    };
  }, []);

  const seleccionarRol = (rol) => {
    setRolSeleccionado(rol);
    // sincrónicamente reflejamos el rol en el form controlado
    handleRegistroChange({ target: { name: 'rol', value: rol } });
    setAbierto(true);
  };

  return (
    <div className="reg-page">
      {/* Video de fondo */}
      <video className="reg-bg" autoPlay muted loop playsInline>
        <source src="/video/bglogin.mp4" type="video/mp4" />
        Tu navegador no soporta video.
      </video>

      {/* Capa de contenido */}
      <div className="reg-overlay">
        <div className={`reg-card ${abierto ? 'open' : ''}`}>
          {!abierto ? (
            <div className="reg-selector">
              <h1 className="reg-title">Selecciona tu rol</h1>
              <div className="reg-roles">
                <button
                  type="button"
                  className="reg-role-button"
                  onClick={() => seleccionarRol('estudiante')}
                >
                  Estudiante
                </button>
                <button
                  type="button"
                  className="reg-role-button"
                  onClick={() => seleccionarRol('conductor')}
                >
                  Conductor
                </button>
              </div>
              {mensaje && <div className="reg-message">{mensaje}</div>}
            </div>
          ) : (
            <div className="reg-form-wrap">
              <div className="reg-header">
                <button
                  type="button"
                  className="reg-back"
                  onClick={() => setAbierto(false)}
                  aria-label="Volver a seleccionar rol"
                >
                  ← Volver
                </button>
                <h2 className="reg-title">
                  Registro {rolSeleccionado === 'conductor' ? 'de Conductor' : 'de Estudiante'}
                </h2>
              </div>

              {mensaje && <div className="reg-message">{mensaje}</div>}

              <form onSubmit={handleRegistroSubmit} className="reg-form">
                <div className="reg-grid">
                  <div className="reg-field">
                    <label htmlFor="registro-nombre">Nombre</label>
                    <input
                      id="registro-nombre"
                      name="nombre"
                      type="text"
                      value={registroForm.nombre}
                      onChange={handleRegistroChange}
                      required
                    />
                  </div>

                  <div className="reg-field">
                    <label htmlFor="registro-apellido">Apellido</label>
                    <input
                      id="registro-apellido"
                      name="apellido"
                      type="text"
                      value={registroForm.apellido}
                      onChange={handleRegistroChange}
                      required
                    />
                  </div>

                  <div className="reg-field">
                    <label htmlFor="registro-email">Email</label>
                    <input
                      id="registro-email"
                      name="email"
                      type="email"
                      value={registroForm.email}
                      onChange={handleRegistroChange}
                      required
                    />
                  </div>

                  <div className="reg-field">
                    <label htmlFor="registro-password">Contraseña</label>
                    <input
                      id="registro-password"
                      name="password"
                      type="password"
                      value={registroForm.password}
                      onChange={handleRegistroChange}
                      required
                    />
                  </div>

                  <div className="reg-field">
                    <label htmlFor="registro-telefono">Teléfono (opcional)</label>
                    <input
                      id="registro-telefono"
                      name="telefono"
                      type="text"
                      value={registroForm.telefono}
                      onChange={handleRegistroChange}
                    />
                  </div>

                  {/* Rol controlado por el selector, pero dejamos el select por si quieres cambiar */}
                  <div className="reg-field">
                    <label htmlFor="registro-rol">Rol</label>
                    <select
                      id="registro-rol"
                      name="rol"
                      value={registroForm.rol}
                      onChange={handleRegistroChange}
                    >
                      <option value="estudiante">Estudiante</option>
                      <option value="conductor">Conductor</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </div>

                <button type="submit" className="reg-submit">Registrar Usuario</button>
              </form>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
