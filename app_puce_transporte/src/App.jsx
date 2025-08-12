// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css'; // Archivo para estilos básicos o generales

// Importa los componentes
import AuthPage from './components/AuthPage.jsx';
import Dashboard from './components/Dashboard.jsx';
import Horarios from './components/Horarios.jsx';
import Reserva from './components/Reserva.jsx';
import Reservas from './components/Reservas1.jsx'; // Importa el nuevo componente Reservas (ahora Reservas1)
import UsuariosRegistrados from './components/UsuariosRegistrados.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import CrearViaje from './components/CrearViaje.jsx'; // Nuevo: Importa el componente CrearViaje

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [registroForm, setRegistroForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    rol: 'estudiante',
    telefono: ''
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    contrasena: ''
  });
  const [mensaje, setMensaje] = useState('');
  // El estado usuarioLogeado se inicializa con null
  const [usuarioLogeado, setUsuarioLogeado] = useState(null);

  const navigate = useNavigate();
  // ¡CORRECCIÓN! La URL de la API ahora apunta al puerto 5000 para coincidir con tu archivo .env
  const API_URL = 'http://localhost:5000/api';

  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios`);
      if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error al obtener usuarios:", error);
      setMensaje('Error al cargar usuarios.');
    }
  };

  const handleRegistroChange = (e) => {
    const { name, value } = e.target;
    setRegistroForm({ ...registroForm, [name]: value });
  };

  const handleRegistroSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const response = await fetch(`${API_URL}/usuarios/registro`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(registroForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `HTTP error! Status: ${response.status}`);

      setMensaje(`Usuario "${data.usuario.nombre}" registrado exitosamente!`);
      setRegistroForm({ nombre: '', apellido: '', email: '', contrasena: '', rol: 'estudiante', telefono: '' });
      fetchUsuarios();
    } catch (error) {
      console.error("Error al registrar usuario:", error);
      setMensaje(`Error al registrar usuario: ${error.message}`);
    }
  };

  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');
    try {
      const response = await fetch(`${API_URL}/usuarios/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(loginForm),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || `HTTP error! Status: ${response.status}`);

      setMensaje(`Bienvenido, ${data.usuario.nombre}! Has iniciado sesión como ${data.usuario.rol}.`);
      // Establece el usuario logeado con todos sus datos, incluyendo foto_perfil_url
      setUsuarioLogeado(data.usuario);
      setLoginForm({ email: '', contrasena: '' });
      navigate('/dashboard');
    } catch (error) {
      console.error("Error durante el inicio de sesión:", error);
      setMensaje(`Error durante el inicio de sesión: ${error.message}`);
    }
  };

  const handleLogout = () => {
    setUsuarioLogeado(null);
    setMensaje('Has cerrado sesión.');
    navigate('/');
  };

  // NUEVA FUNCIÓN: Para actualizar el usuarioLogeado en App.jsx con la nueva URL de la foto de perfil
  const updateUsuarioLogeadoProfilePic = (newImageUrl) => {
    // Solo actualiza si hay un usuario logeado
    if (usuarioLogeado) {
      setUsuarioLogeado(prevUser => ({
        ...prevUser, // Mantiene todas las propiedades del usuario actual
        foto_perfil_url: newImageUrl, // Actualiza solo la propiedad foto_perfil_url
      }));
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="app-container">
      <Routes>
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
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute usuarioLogeado={usuarioLogeado}>
              <Dashboard
                usuarioLogeado={usuarioLogeado}
                handleLogout={handleLogout}
                updateUsuarioLogeadoProfilePic={updateUsuarioLogeadoProfilePic} // Pasa la nueva función
              />
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
              <Reserva usuarioLogeado={usuarioLogeado} />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reservas" // Nueva ruta para el componente Reservas1
          element={
            <ProtectedRoute usuarioLogeado={usuarioLogeado}>
              <Reservas /> {/* Renderiza el componente Reservas1 */}
            </ProtectedRoute>
          }
        />
        <Route
          path="/usuarios-registrados"
          element={
            <ProtectedRoute usuarioLogeado={usuarioLogeado} allowedRoles={['admin']}>
              <UsuariosRegistrados usuarios={usuarios} />
            </ProtectedRoute>
          }
        />
        <Route // Nueva ruta para el componente CrearViaje
          path="/crear-viaje"
          element={
            <ProtectedRoute usuarioLogeado={usuarioLogeado} allowedRoles={['conductor']}>
              <CrearViaje usuarioLogeado={usuarioLogeado} />
            </ProtectedRoute>
          }
        />
      </Routes>
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
