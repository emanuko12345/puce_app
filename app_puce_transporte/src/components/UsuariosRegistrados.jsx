// app_puce/src/components/UsuariosRegistrados.jsx
import React from 'react';

function UsuariosRegistrados({ usuarios }) {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Lista de Usuarios Registrados</h2>
      {usuarios.length > 0 ? (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-md">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">ID</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nombre</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Rol</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Teléfono</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {usuarios.map((usuario) => (
                <tr key={usuario.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{usuario.id}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{usuario.nombre} {usuario.apellido}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.email}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.rol}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{usuario.telefono || 'N/A'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <p className="text-gray-600 text-center">No hay usuarios registrados aún.</p>
      )}
    </div>
  );
}

export default UsuariosRegistrados;