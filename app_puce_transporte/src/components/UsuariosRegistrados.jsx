import React from 'react';
import './UsuariosRegistrados.css';

function UsuariosRegistrados({ usuarios }) {
  return (
    <div className="contenedor">
      <h2 className="titulo">Lista de Usuarios Registrados</h2>
      {usuarios.length > 0 ? (
        <div className="tabla-contenedor">
          <table className="tabla-usuarios">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Rol</th>
                <th>Teléfono</th>
              </tr>
            </thead>
            <tbody>
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td>{usuario.id}</td>
                  <td>{usuario.nombre} {usuario.apellido}</td>
                  <td>{usuario.email}</td>
                  <td>{usuario.rol}</td>
                  <td>{usuario.telefono || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="mensaje-vacio">No hay usuarios registrados aún.</p>
      )}
    </div>
  );
}

export default UsuariosRegistrados;