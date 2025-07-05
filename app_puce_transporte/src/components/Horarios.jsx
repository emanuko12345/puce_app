// app_puce/src/components/Horarios.jsx
import React from 'react';

function Horarios() {
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Horarios de Rutas</h2>
      <p className="text-gray-600">Aquí se mostrarán los horarios de las rutas de transporte.</p>
      {/* Agrega la lógica y el contenido para los horarios */}
      <ul className="list-disc list-inside mt-4">
        <li>Ruta A: 07:00 AM, 12:00 PM, 05:00 PM</li>
        <li>Ruta B: 07:30 AM, 01:00 PM, 06:00 PM</li>
        {/* Más horarios... */}
      </ul>
    </div>
  );
}

export default Horarios;