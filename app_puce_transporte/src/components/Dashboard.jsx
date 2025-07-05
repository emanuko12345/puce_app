// app_puce/src/components/Dashboard.jsx
import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ usuarioLogeado, handleLogout }) {
  if (!usuarioLogeado) {
    // Esto es una capa de seguridad extra, aunque ProtectedRoute ya debería manejarlo
    return <p>Por favor, inicia sesión para ver el Dashboard.</p>;
  }

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-4xl">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        Bienvenido, {usuarioLogeado.nombre}!
      </h1>

      <div className="mb-8 p-4 bg-green-50 rounded-md border border-green-200">
        <h2 className="text-xl font-semibold text-green-800">Sesión Iniciada</h2>
        <p className="text-gray-700">Usuario: {usuarioLogeado.nombre} {usuarioLogeado.apellido} ({usuarioLogeado.email})</p>
        <p className="text-gray-700">Rol: {usuarioLogeado.rol}</p>
        <button
          onClick={handleLogout}
          className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
        >
          Cerrar Sesión
        </button>
      </div>

      <nav className="mb-8">
        <ul className="flex flex-wrap justify-center gap-4">
          <li>
            <Link
              to="/horarios"
              className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out block text-center"
            >
              Ver Horarios
            </Link>
          </li>
          <li>
            <Link
              to="/reserva"
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out block text-center"
            >
              Realizar Reserva
            </Link>
          </li>
          {/* Solo los administradores pueden ver la lista de usuarios */}
          {usuarioLogeado.rol === 'admin' && (
            <li>
              <Link
                to="/usuarios-registrados"
                className="bg-orange-600 hover:bg-orange-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out block text-center"
              >
                Ver Usuarios Registrados
              </Link>
            </li>
          )}
           {/* Ejemplo de navegación para el rol de conductor */}
           {usuarioLogeado.rol === 'conductor' && (
            <li>
              <Link
                to="/mis-rutas"
                className="bg-yellow-600 hover:bg-yellow-700 text-white font-bold py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out block text-center"
              >
                Mis Rutas
              </Link>
            </li>
          )}
        </ul>
      </nav>

      <div className="mt-8 p-6 bg-gray-50 border border-gray-200 rounded-md">
        <h2 className="text-2xl font-semibold text-gray-700 mb-4">Información del Sistema</h2>
        <p className="text-gray-600">Desde aquí puedes navegar a las diferentes funcionalidades de la aplicación de transporte de la PUCE.</p>
      </div>
    </div>
  );
}

export default Dashboard;