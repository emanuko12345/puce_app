// src/App.jsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate } from 'react-router-dom';
import './App.css'; // Archivo para estilos básicos o generales

// Importa los componentes
import AuthPage from './components/AuthPage';
import Dashboard from './components/Dashboard';
import Horarios from './components/Horarios';
import Reserva from './components/Reserva';
import UsuariosRegistrados from './components/UsuariosRegistrados';
import ProtectedRoute from './components/ProtectedRoute';

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
  const [usuarioLogeado, setUsuarioLogeado] = useState(null);

  const navigate = useNavigate();
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
              <Reserva usuarioLogeado={usuarioLogeado} />
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