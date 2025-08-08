import React from 'react';
import './AnimacionRegistro.css'; // mismo CSS que el contenedor animado

function RegistroPage({
  registroForm,
  handleRegistroChange,
  handleRegistroSubmit,
  mensaje
}) {
  return (
    <div className="form-registro">
      <h2>
        Registro de {registroForm.rol === "conductor" ? "Conductor" : "Estudiante"}
      </h2>

      {mensaje && (
        <div className="auth-message" role="alert">
          <span>{mensaje}</span>
        </div>
      )}

      <form onSubmit={handleRegistroSubmit} className="registro-form">
        <input
          type="text"
          name="nombre"
          placeholder="Nombre"
          value={registroForm.nombre}
          onChange={handleRegistroChange}
          required
        />
        <input
          type="text"
          name="apellido"
          placeholder="Apellido"
          value={registroForm.apellido}
          onChange={handleRegistroChange}
          required
        />
        <input
          type="email"
          name="email"
          placeholder="Correo electrónico"
          value={registroForm.email}
          onChange={handleRegistroChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Contraseña"
          value={registroForm.password}
          onChange={handleRegistroChange}
          required
        />

        {/* Teléfono opcional */}
        <input
          type="text"
          name="telefono"
          placeholder="Teléfono (opcional)"
          value={registroForm.telefono}
          onChange={handleRegistroChange}
        />

        {/* El rol ya viene seleccionado desde RegistroAnimado */}
        <input type="hidden" name="rol" value={registroForm.rol} />

        <input type="submit" value="Registrar Usuario" />
      </form>
    </div>
  );
}

export default RegistroPage;
