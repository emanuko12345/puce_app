// app_puce/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css'; // Asegúrate de que tu archivo CSS exista
import AppWrapper from './App.jsx'; // Importa el componente principal de tu aplicación, ahora llamado AppWrapper

// Obtiene el elemento DOM donde se montará la aplicación.
// ¡Asegúrate de que tu index.html tenga un <div id="root"></div>!
const rootElement = document.getElementById('root');

// Crea la raíz de React 18
const root = createRoot(rootElement);

// Renderiza la aplicación dentro de StrictMode para detectar problemas potenciales durante el desarrollo.
root.render(
  <StrictMode>
    <AppWrapper /> {/* Usa el AppWrapper que ya incluye el Router */}
  </StrictMode>,
);