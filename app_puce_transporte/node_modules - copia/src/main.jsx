// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx'; // Importa tu componente principal App
import './index.css'; // O './App.css' si lo estás usando como archivo CSS principal para estilos globales

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App /> {/* Aquí es donde tu componente App se renderiza */}
  </React.StrictMode>,
);
