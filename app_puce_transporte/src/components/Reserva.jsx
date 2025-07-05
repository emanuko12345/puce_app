// app_puce/src/components/Reserva.jsx
import React, { useState } from 'react';

function Reserva() {
  const [destino, setDestino] = useState('');
  const [fecha, setFecha] = useState('');
  const [mensajeReserva, setMensajeReserva] = useState('');

  const handleReservaSubmit = (e) => {
    e.preventDefault();
    // Aquí iría la lógica para enviar la reserva al backend
    console.log('Reserva:', { destino, fecha });
    setMensajeReserva(`Reserva para ${destino} el ${fecha} realizada con éxito! (Simulado)`);
    setDestino('');
    setFecha('');
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold text-gray-800 mb-4">Realizar Reserva</h2>
      <p className="text-gray-600 mb-4">Selecciona tu destino y fecha para reservar un asiento.</p>
      <form onSubmit={handleReservaSubmit} className="space-y-4">
        <div>
          <label htmlFor="destino" className="block text-sm font-medium text-gray-700">Destino:</label>
          <input
            type="text"
            id="destino"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={destino}
            onChange={(e) => setDestino(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">Fecha:</label>
          <input
            type="date"
            id="fecha"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
            value={fecha}
            onChange={(e) => setFecha(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
        >
          Reservar
        </button>
      </form>
      {mensajeReserva && (
        <div className="mt-4 bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative" role="alert">
          {mensajeReserva}
        </div>
      )}
    </div>
  );
}

export default Reserva;