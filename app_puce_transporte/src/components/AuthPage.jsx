// app_puce/src/components/AuthPage.jsx
import React from 'react';

// Componente para la página de autenticación (Login/Registro)
function AuthPage({
  registroForm, handleRegistroChange, handleRegistroSubmit,
  loginForm, handleLoginChange, handleLoginSubmit,
  mensaje
}) {
  return (
    <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
        PUCE Transport App
      </h1>

      {/* Área para mostrar mensajes */}
      {mensaje && (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6" role="alert">
          <span className="block sm:inline">{mensaje}</span>
        </div>
      )}

      {/* Formulario de Registro de Usuario */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
        Registro de Usuario
      </h2>
      <form onSubmit={handleRegistroSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-6 border border-gray-200 rounded-md shadow-sm">
        <div>
          <label htmlFor="registro-nombre" className="block text-sm font-medium text-gray-700">Nombre:</label>
          <input
            type="text"
            id="registro-nombre"
            name="nombre"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={registroForm.nombre}
            onChange={handleRegistroChange}
            required
          />
        </div>
        <div>
          <label htmlFor="registro-apellido" className="block text-sm font-medium text-gray-700">Apellido:</label>
          <input
            type="text"
            id="registro-apellido"
            name="apellido"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={registroForm.apellido}
            onChange={handleRegistroChange}
            required
          />
        </div>
        <div>
          <label htmlFor="registro-email" className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="registro-email"
            name="email"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={registroForm.email}
            onChange={handleRegistroChange}
            required
          />
        </div>
        <div>
          <label htmlFor="registro-contrasena" className="block text-sm font-medium text-gray-700">Contraseña:</label>
          <input
            type="password"
            id="registro-contrasena"
            name="contrasena"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={registroForm.contrasena}
            onChange={handleRegistroChange}
            required
          />
        </div>
        <div>
          <label htmlFor="registro-rol" className="block text-sm font-medium text-gray-700">Rol:</label>
          <select
            id="registro-rol"
            name="rol"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={registroForm.rol}
            onChange={handleRegistroChange}
          >
            <option value="estudiante">Estudiante</option>
            <option value="conductor">Conductor</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div>
          <label htmlFor="registro-telefono" className="block text-sm font-medium text-gray-700">Teléfono (Opcional):</label>
          <input
            type="text"
            id="registro-telefono"
            name="telefono"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={registroForm.telefono}
            onChange={handleRegistroChange}
          />
        </div>
        <div className="md:col-span-2">
          <button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
          >
            Registrar Usuario
          </button>
        </div>
      </form>

      {/* Formulario de Inicio de Sesión de Usuario */}
      <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
        Inicio de Sesión
      </h2>
      <form onSubmit={handleLoginSubmit} className="space-y-4 mb-8 p-6 border border-gray-200 rounded-md shadow-sm">
        <div>
          <label htmlFor="login-email" className="block text-sm font-medium text-gray-700">Email:</label>
          <input
            type="email"
            id="login-email"
            name="email"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={loginForm.email}
            onChange={handleLoginChange}
            required
          />
        </div>
        <div>
          <label htmlFor="login-contrasena" className="block text-sm font-medium text-gray-700">Contraseña:</label>
          <input
            type="password"
            id="login-contrasena"
            name="contrasena"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-green-500 focus:border-green-500 sm:text-sm"
            value={loginForm.contrasena}
            onChange={handleLoginChange}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
        >
          Iniciar Sesión
        </button>
      </form>
    </div>
  );
}

export default AuthPage;