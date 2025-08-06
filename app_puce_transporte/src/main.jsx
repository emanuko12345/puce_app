// app_puce_transporte/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './App.jsx';
import './App.css'; // Asegúrate de importar estilos aquí

const rootElement = document.getElementById('root');

const applyRootClass = () => {
  if (window.location.pathname === '/') {
    rootElement.classList.add('welcome-root');
  } else {
    rootElement.classList.remove('welcome-root');
  }
};

// Aplica la clase inicial
applyRootClass();

// Escucha cambios en la ruta (cuando navegas con el botón)
window.addEventListener('popstate', applyRootClass);

// Para cuando usas pushState (navegación programática como navigate('/login'))
const originalPushState = history.pushState;
history.pushState = function (...args) {
  originalPushState.apply(this, args);
  window.dispatchEvent(new Event('popstate'));
};

const root = createRoot(rootElement);
root.render(
  <StrictMode>
    <AppWrapper />
  </StrictMode>
);
