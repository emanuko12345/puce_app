// app_puce/src/App.jsx

import React, { useState, useEffect } from 'react';
import './App.css'; // Ensure this file exists for basic styles

function App() {
  // State for storing the list of users fetched from the backend
  const [usuarios, setUsuarios] = useState([]);
  // State for the registration form fields
  const [registroForm, setRegistroForm] = useState({
    nombre: '',
    apellido: '',
    email: '',
    contrasena: '',
    rol: 'estudiante', // Default role
    telefono: ''
  });
  // State for the login form fields
  const [loginForm, setLoginForm] = useState({
    email: '',
    contrasena: ''
  });
  // State for displaying messages to the user (success/error)
  const [mensaje, setMensaje] = useState('');
  // State to store the currently logged-in user's data
  const [usuarioLogeado, setUsuarioLogeado] = useState(null);

  // Base URL for your backend API
  const API_URL = 'http://localhost:5000/api';

  // Function to fetch all users from the backend
  const fetchUsuarios = async () => {
    try {
      const response = await fetch(`${API_URL}/usuarios`);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      const data = await response.json();
      setUsuarios(data);
    } catch (error) {
      console.error("Error fetching users:", error);
      setMensaje('Error loading users.');
    }
  };

  // Handler for changes in the registration form fields
  const handleRegistroChange = (e) => {
    const { name, value } = e.target;
    setRegistroForm({ ...registroForm, [name]: value });
  };

  // Handler for submitting the registration form
  const handleRegistroSubmit = async (e) => {
    e.preventDefault();
    setMensaje(''); // Clear previous messages
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

      setMensaje(`User "${data.usuario.nombre}" registered successfully!`);
      // Clear the registration form
      setRegistroForm({ nombre: '', apellido: '', email: '', contrasena: '', rol: 'estudiante', telefono: '' });
      fetchUsuarios(); // Reload the user list
    } catch (error) {
      console.error("Error registering user:", error);
      setMensaje(`Error registering user: ${error.message}`);
    }
  };

  // Handler for changes in the login form fields
  const handleLoginChange = (e) => {
    const { name, value } = e.target;
    setLoginForm({ ...loginForm, [name]: value });
  };

  // Handler for submitting the login form
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setMensaje(''); // Clear previous messages
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

      setMensaje(`Welcome, ${data.usuario.nombre}! You have logged in as ${data.usuario.rol}.`);
      setUsuarioLogeado(data.usuario); // Store the logged-in user
      setLoginForm({ email: '', contrasena: '' }); // Clear the login form
    } catch (error) {
      console.error("Error during login:", error);
      setMensaje(`Error during login: ${error.message}`);
    }
  };

  // Function to handle user logout
  const handleLogout = () => {
    setUsuarioLogeado(null);
    setMensaje('You have logged out.');
  };

  // Load users when the component mounts
  useEffect(() => {
    fetchUsuarios();
  }, []); // Empty dependency array ensures it runs only once on mount

  return (
    <div className="min-h-screen bg-gray-100 p-8 flex flex-col items-center justify-center font-inter">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-3xl">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          PUCE Transport App
        </h1>

        {/* Message display area */}
        {mensaje && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-6" role="alert">
            <span className="block sm:inline">{mensaje}</span>
          </div>
        )}

        {/* Conditional rendering based on login status */}
        {usuarioLogeado ? (
          <div className="mb-8 p-4 bg-green-50 rounded-md border border-green-200">
            <h2 className="text-xl font-semibold text-green-800">Session Started</h2>
            <p className="text-gray-700">User: {usuarioLogeado.nombre} {usuarioLogeado.apellido} ({usuarioLogeado.email})</p>
            <p className="text-gray-700">Role: {usuarioLogeado.rol}</p>
            <button
              onClick={handleLogout}
              className="mt-4 bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
            >
              Logout
            </button>
          </div>
        ) : (
          <>
            {/* User Registration Form */}
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
              User Registration
            </h2>
            <form onSubmit={handleRegistroSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 p-6 border border-gray-200 rounded-md shadow-sm">
              <div>
                <label htmlFor="registro-nombre" className="block text-sm font-medium text-gray-700">Name:</label>
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
                <label htmlFor="registro-apellido" className="block text-sm font-medium text-gray-700">Last Name:</label>
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
                <label htmlFor="registro-contrasena" className="block text-sm font-medium text-gray-700">Password:</label>
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
                <label htmlFor="registro-rol" className="block text-sm font-medium text-gray-700">Role:</label>
                <select
                  id="registro-rol"
                  name="rol"
                  className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                  value={registroForm.rol}
                  onChange={handleRegistroChange}
                >
                  <option value="estudiante">Student</option>
                  <option value="conductor">Driver</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              <div>
                <label htmlFor="registro-telefono" className="block text-sm font-medium text-gray-700">Phone (Optional):</label>
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
                  Register User
                </button>
              </div>
            </form>

            {/* User Login Form */}
            <h2 className="text-2xl font-semibold text-gray-700 mb-4 text-center">
              User Login
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
                <label htmlFor="login-contrasena" className="block text-sm font-medium text-gray-700">Password:</label>
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
                Login
              </button>
            </form>
          </>
        )}

        {/* List of Registered Users */}
        <h2 className="text-2xl font-semibold text-gray-700 mt-8 mb-4 text-center">
          List of Registered Users
        </h2>
        {usuarios.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 rounded-lg shadow-md">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">ID</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">Phone</th>
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
          <p className="text-gray-600 text-center">No registered users yet.</p>
        )}
      </div>
    </div>
  );
}

export default App;