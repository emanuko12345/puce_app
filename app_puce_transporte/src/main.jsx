// app_puce/src/main.jsx
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import AppWrapper from './App.jsx'; // Importa el componente principal de tu aplicación, ahora llamado AppWrapper


// ** IMPORTAR ESTILOS GLOBALES AQUÍ **
// Asumiendo que has movido las reglas esenciales de html/body y #root a app.css
// (Si app.css contiene los estilos globales, se importa aquí)

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