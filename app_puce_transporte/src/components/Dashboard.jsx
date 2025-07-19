import React from 'react';
import { Link } from 'react-router-dom';

function Dashboard({ usuarioLogeado, handleLogout }) {
    if (!usuarioLogeado) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md text-center max-w-md mx-auto my-8 font-inter">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Acceso Denegado</h2>
                <p className="text-gray-600 mb-4">Por favor, inicia sesión para acceder al dashboard.</p>
                <Link to="/" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
                    Ir a Inicio de Sesión
                </Link>
            </div>
        );
    }

    return (
        <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-2xl text-center font-inter">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Bienvenido, {usuarioLogeado.nombre}!</h1>
            <p className="text-xl text-gray-600 mb-6">Sesión Iniciada</p>

            <div className="mb-8 p-4 bg-gray-50 rounded-md border border-gray-200">
                <p className="text-gray-700">Usuario: {usuarioLogeado.nombre} {usuarioLogeado.apellido} ({usuarioLogeado.email})</p>
                <p className="text-gray-700">Rol: {usuarioLogeado.rol}</p>
                {usuarioLogeado.telefono && <p className="text-gray-700">Teléfono: {usuarioLogeado.telefono}</p>}
            </div>

            <button
                onClick={handleLogout}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out mb-8"
            >
                Cerrar Sesión
            </button>

            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Funcionalidades</h2>
            <nav className="flex flex-col items-center space-y-3">
                <Link to="/horarios" className="text-blue-600 hover:text-blue-800 text-lg font-medium">
                    Ver Horarios
                </Link>
                <Link to="/reserva" className="text-blue-600 hover:text-blue-800 text-lg font-medium">
                    Realizar Reserva
                </Link>
                {/* Enlace para Crear Viaje - visible solo para conductores */}
                {usuarioLogeado.rol === 'conductor' && (
                    <Link to="/crear-viaje" className="text-green-600 hover:text-green-800 text-lg font-medium">
                        Registrar Nuevo Viaje
                    </Link>
                )}
                {/* Enlace para Mis Rutas - visible solo para conductores */}
                {usuarioLogeado.rol === 'conductor' && (
                    <Link to="/mis-rutas" className="text-blue-600 hover:text-blue-800 text-lg font-medium">
                        Mis Rutas
                    </Link>
                )}
                {/* Enlace para Usuarios Registrados - visible solo para administradores */}
                {usuarioLogeado.rol === 'admin' && (
                    <Link to="/usuarios-registrados" className="text-purple-600 hover:text-purple-800 text-lg font-medium">
                        Ver Usuarios Registrados
                    </Link>
                )}
            </nav>

            <div className="mt-8 p-4 bg-gray-50 rounded-md border border-gray-200">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">Información del Sistema</h3>
                <p className="text-gray-600">Desde aquí puedes navegar a las diferentes funcionalidades de la aplicación de transporte de la PUCE.</p>
            </div>
        </div>
    );
}

export default Dashboard;
