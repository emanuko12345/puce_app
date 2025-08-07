import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css';

// Componentes
import Dashboard from './components/Dashboard.jsx';
import Horarios from './components/Horarios.jsx';
import Reserva from './components/Reserva.jsx';
import Reservas from './components/Reservas1.jsx';
import UsuariosRegistrados from './components/UsuariosRegistrados.jsx';
import ProtectedRoute from './components/ProtectedRoute.jsx';
import WelcomeVideo from './components/WelcomeVideo.jsx';
import SplashCursor from './components/SplashCursor.jsx';
import LoginPage from './components/LoginPage.jsx';
import RegistroPage from './components/RegistroPage.jsx';

function App() {
  const [usuarios, setUsuarios] = useState([]);
  const [registroForm, setRegistroForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    password: '',
    rol: 'estudiante',
    telefono: ''
  });
  const [loginForm, setLoginForm] = useState({
    email: '',
    password: ''
  });
  const [mensaje, setMensaje] = useState('');
  const [usuarioLogeado, setUsuarioLogeado] = useState(null);

  const navigate = useNavigate();
  const API_URL = 'http://localhost:5050/api';

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
      setRegistroForm({ nombre: '', apellido: '', email: '', password: '', rol: 'estudiante', telefono: '' });
      fetchUsuarios();
      navigate('/login');
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
      setUsuarioLogeado(data.usuario);
      setLoginForm({ email: '', password: '' });
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

  const updateUsuarioLogeadoProfilePic = (newImageUrl) => {
    if (usuarioLogeado) {
      setUsuarioLogeado(prevUser => ({
        ...prevUser,
        foto_perfil_url: newImageUrl,
      }));
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  return (
    <div className="app-container">
      <SplashCursor />
      <Routes>
        <Route path="/" element={<WelcomeVideo />} />
        <Route
          path="/login"
          element={
            <LoginPage
              loginForm={loginForm}
              handleLoginChange={handleLoginChange}
              handleLoginSubmit={handleLoginSubmit}
              mensaje={mensaje}
            />
          }
        />
        <Route
          path="/registro"
          element={
            <RegistroPage
              registroForm={registroForm}
              handleRegistroChange={handleRegistroChange}
              handleRegistroSubmit={handleRegistroSubmit}
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
                updateUsuarioLogeadoProfilePic={updateUsuarioLogeadoProfilePic}
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
          path="/reservas"
          element={
            <ProtectedRoute usuarioLogeado={usuarioLogeado}>
              <Reservas />
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
        <Route
          path="*"
          element={
            <div className="text-center p-8 bg-white rounded-lg shadow-lg">
              <h2 className="text-3xl font-bold text-red-600">404 - Página no encontrada</h2>
              <p className="mt-4 text-gray-700">Lo sentimos, la página que buscas no existe.</p>
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

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
