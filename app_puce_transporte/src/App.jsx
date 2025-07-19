// app_puce/src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css'; // Asegúrate de que este archivo exista para estilos básicos

// Importa los nuevos componentes desde la carpeta 'components'
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Horarios from './components/Horarios';
import Reserva from './components/Reserva';
import UsuariosRegistrados from './components/UsuariosRegistrados';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  // Estado para la lista de usuarios obtenida del backend
  const [usuarios, setUsuarios] = useState([]);
  // Estado para los campos del formulario de registro (Alineado con tu esquema de 'usuarios')
  const [registroForm, setRegistroForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    rol: 'estudiante', // Valor por defecto según tu esquema
    telefono: ''
  });
  // Estado para los campos del formulario de inicio de sesión (Alineado con tu esquema de 'usuarios')
  const [loginForm, setLoginForm] = useState({
    email: '',
    contrasena: ''
  });
  // Estado para mostrar mensajes al usuario (éxito/error)
  const [mensaje, setMensaje] = useState('');
  // Estado para almacenar los datos del usuario actualmente logeado
  const [usuarioLogeado, setUsuarioLogeado] = useState(null); // null significa no logeado

  // Hook para la navegación programática
  const navigate = useNavigate();

  // URL base para tu API backend
  const API_URL = 'http://localhost:5000/api';

  // Función para obtener todos los usuarios del backend
  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setMensaje('Error al cargar usuarios.');
    }
  };

  // Manejador para cambios en los campos del formulario de registro
  const handleRegistroChange = (e) => {
    const { name, value } = e.target;
    setRegistroForm({ ...registroForm, [name]: value });
  };

  // Manejador para enviar el formulario de registro
  const handleRegistroSubmit = async (e) => {
    e.preventDefault();
    setMensaje(''); // Limpiar mensajes anteriores
    try {
      const response = await fetch(`${API_URL}/usuarios/registro`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(registroForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! Status: ${response.status}`);
      }

      setMensaje(`Usuario "${data.usuario.nombre}" registrado exitosamente!`);
      // Limpiar el formulario de registro (Alineado con tu esquema)
      setRegistroForm({ nombre: '', apellido: '', email: '', contrasena: '', rol: 'estudiante', telefono: '' }); 
      fetchUsuarios(); // Recargar la lista de usuarios
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setMensaje(`Error al registrar usuario: ${error.message}`);
    }
  };

  // Manejador para cambios en los campos del formulario de inicio de sesión
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  // Manejador para enviar el formulario de inicio de sesión
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMensaje(''); // Limpiar mensajes anteriores
    try {
      const response = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(loginForm),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || `HTTP error! Status: ${response.status}`);
      }

      setMensaje(`Bienvenido, ${data.usuario.nombre}! Has iniciado sesión como ${data.usuario.rol}.`); 
      setUsuarioLogeado(data.usuario); // Almacenar el usuario logeado
      // Limpiar el formulario de inicio de sesión (Alineado con tu esquema)
      setLoginForm({ email: '', contrasena: '' }); 
      navigate('/dashboard'); // Redirigir al dashboard después del login
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      setMensaje(`Error durante el inicio de sesión: ${error.message}`);
    }
  };

  // Función para manejar el cierre de sesión
  const handleLogout = () => {
    setUsuarioLogeado(null); // Limpiar el usuario logeado
    setMensaje('Has cerrado sesión.');
    navigate('/'); // Redirigir a la página principal (login/registro) después de cerrar sesión
  };

  // Cargar usuarios cuando el componente se monta (solo una vez)
  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center font-inter">
      {/* Routes es el contenedor para todas tus rutas */}
      <Routes>
        {/* Ruta para la página de autenticación (Login/Registro) */}
        {/* Esta ruta es pública, no requiere autenticación */}
        <Route
          path="/"
          element={
            <AuthPage
              registroForm={registroForm}
              handleRegistroChange={handleRegistroChange}
              handleRegistroSubmit={handleRegistroSubmit}
              loginForm={loginForm}
              handleLoginChange={handleLoginChange}
              handleLoginSubmit={handleLoginSubmit}
              mensaje={mensaje}
            />
          }
        />

        {/* Rutas Protegidas: Envueltas por ProtectedRoute */}
        {/* Solo accesibles si hay un usuario logeado */}
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute usuarioLogeado={usuarioLogeado}>
              <Dashboard usuarioLogeado={usuarioLogeado} handleLogout={handleLogout} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/horarios"
          element={
            <ProtectedRoute usuarioLogeado={usuarioLogeado}>
              <Horarios />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reserva"
          element={
            <ProtectedRoute usuarioLogeado={usuarioLogeado}>
              {/* Se pasa la prop usuarioLogeado al componente Reserva */}
              <Reserva usuarioLogeado={usuarioLogeado} />
            </ProtectedRoute>
          }
        />
        {/* Ruta protegida y solo para administradores */}
        <Route
          path="/usuarios-registrados"
          element={
            <ProtectedRoute usuarioLogeado={usuarioLogeado} allowedRoles={['admin']}>
              <UsuariosRegistrados usuarios={usuarios} />
            </ProtectedRoute>
          }
        />
        {/* Ruta protegida y solo para conductores */}
        <Route
          path="/mis-rutas"
          element={
            <ProtectedRoute usuarioLogeado={usuarioLogeado} allowedRoles={['conductor']}>
              <div className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Mis Rutas (Conductor)</h2>
                <p className="text-gray-600">Aquí el conductor puede ver y gestionar sus rutas asignadas.</p>
              </div>
            </ProtectedRoute>
          }
        />

        {/* Ruta Catch-all para URLs no definidas (Página 404) */}
        <Route
          path="*"
          element={
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-red-600">404 - Página no encontrada</h2>
              <p className="mt-4 text-gray-700">Lo sentimos, la página que buscas no existe.</p>
              {/* Enlace para volver al dashboard si está logeado, o a la página de inicio si no */}
              <Link to={usuarioLogeado ? "/dashboard" : "/"} className="mt-6 inline-block bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-md">
                Volver al Inicio
              </Link>
            </div>
          }
        />
      </Routes>
    </div>
  );
}

// Envuelve el componente App con Router en main.jsx
// Se exporta como AppWrapper para ser importado en main.jsx
export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
