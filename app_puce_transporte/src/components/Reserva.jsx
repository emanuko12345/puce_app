import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

function Reserva({ usuarioLogeado }) {
    // Estados para los campos del formulario de reserva
    const [viajesDisponibles, setViajesDisponibles] = useState([]); // Para almacenar la lista de viajes
    const [selectedViajeId, setSelectedViajeId] = useState(''); // ID del viaje seleccionado
    const [numeroAsientos, setNumeroAsientos] = useState(''); // Número de asientos a reservar
    const [mensajeReserva, setMensajeReserva] = useState(''); // Para mensajes de éxito/error

    const navigate = useNavigate();

    // URL base para tu API backend
    const API_URL = 'http://localhost:5000/api';

    // Función para obtener los viajes disponibles del backend
    const fetchViajesDisponibles = async () => {
        try {
            const response = await fetch(`${API_URL}/viajes`);
            if (!response.ok) {
                throw new Error(`Error HTTP! Estado: ${response.status}`);
            }
            const data = await response.json();
            setViajesDisponibles(data);
            // Si hay viajes, selecciona el primero por defecto
            if (data.length > 0) {
                setSelectedViajeId(data[0].id); 
            } else {
                setSelectedViajeId(''); // Si no hay viajes, no seleccionar nada
            }
        } catch (error) {
            console.error("Error al obtener viajes disponibles:", error);
            setMensajeReserva('Error al cargar los viajes disponibles.');
        }
    };

    // Cargar viajes disponibles cuando el componente se monta
    useEffect(() => {
        fetchViajesDisponibles();
    }, []);

    const handleReservaSubmit = async (e) => {
        e.preventDefault();
        setMensajeReserva(''); // Limpiar mensajes anteriores

        if (!usuarioLogeado) {
            setMensajeReserva('Debes iniciar sesión para hacer una reserva.');
            return;
        }

        if (!selectedViajeId) {
            setMensajeReserva('Por favor, selecciona un viaje.');
            return;
        }

        const asientosAReservar = parseInt(numeroAsientos, 10);
        if (isNaN(asientosAReservar) || asientosAReservar <= 0) {
            setMensajeReserva('Por favor, ingresa un número válido de asientos (mayor que 0).');
            return;
        }

        // Obtener la información completa del viaje seleccionado
        const viajeSeleccionado = viajesDisponibles.find(viaje => viaje.id === parseInt(selectedViajeId, 10));
        if (!viajeSeleccionado) {
            setMensajeReserva('El viaje seleccionado no es válido o no está disponible.');
            return;
        }

        // Verificar disponibilidad en el frontend (aunque el backend también lo hará)
        if (asientosAReservar > viajeSeleccionado.asientos_disponibles) {
            setMensajeReserva(`Solo quedan ${viajeSeleccionado.asientos_disponibles} asientos disponibles para este viaje.`);
            return;
        }

        // Combinar fecha_salida y hora_salida del viaje seleccionado en un formato de timestamp para fecha_reserva
        // Tu tabla 'reservas' tiene 'fecha_reserva' como TIMESTAMP.
        // La 'fecha_salida' del viaje es DATE y 'hora_salida' es TIME.
        // Formato esperado por PostgreSQL para TIMESTAMP: 'YYYY-MM-DD HH:MM:SS' o 'YYYY-MM-DDTHH:MM:SS'
        const fechaReservaTimestamp = `${viajeSeleccionado.fecha_salida.split('T')[0]}T${viajeSeleccionado.hora_salida}`; 
        // Nota: Si 'hora_salida' no tiene segundos, PostgreSQL puede inferirlos. Si tiene, asegúrate de que el formato coincida.

        // Crear el objeto de reserva con los datos del formulario y el usuario logeado
        const nuevaReserva = {
            estudiante_id: usuarioLogeado.id, // ¡Usamos estudiante_id como en tu esquema!
            viaje_id: parseInt(selectedViajeId, 10), // ID del viaje seleccionado
            fecha_reserva: fechaReservaTimestamp, // Fecha y hora de la reserva (usando la del viaje)
            estado: 'confirmada', // Estado inicial de la reserva, según tu DEFAULT en DB
            numero_asientos: asientosAReservar, // Número de asientos a reservar
        };

        console.log('Datos a enviar para la reserva:', nuevaReserva);

        try {
            const response = await fetch(`${API_URL}/reservas`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(nuevaReserva),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || `Error HTTP! Estado: ${response.status}`);
            }

            setMensajeReserva(`Reserva de ${data.reserva.numero_asientos} asientos para el Viaje ID: ${data.reserva.viaje_id} realizada con éxito!`);
            // Limpiar el formulario y recargar viajes para actualizar disponibilidad
            setNumeroAsientos('');
            fetchViajesDisponibles(); // Recargar la lista para mostrar la disponibilidad actualizada

        } catch (error) {
            console.error("Error al realizar la reserva:", error);
            setMensajeReserva(`Error al realizar la reserva: ${error.message}`);
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-xl mx-auto my-8 font-inter">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Realizar Reserva</h2>
            <p className="text-gray-600 mb-6">Selecciona un viaje disponible y la cantidad de asientos que deseas reservar.</p>

            <form onSubmit={handleReservaSubmit} className="space-y-4">
                <div>
                    <label htmlFor="selectViaje" className="block text-sm font-medium text-gray-700">Seleccionar Viaje:</label>
                    <select
                        id="selectViaje"
                        name="selectViaje"
                        value={selectedViajeId}
                        onChange={(e) => setSelectedViajeId(e.target.value)}
                        required
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    >
                        {viajesDisponibles.length > 0 ? (
                            <>
                                <option value="">-- Selecciona un viaje --</option>
                                {viajesDisponibles.map((viaje) => (
                                    <option key={viaje.id} value={viaje.id}>
                                        {/* Muestra detalles relevantes del viaje: Ruta, Fecha, Hora, Asientos, Conductor */}
                                        {viaje.nombre_ruta} ({viaje.origen} a {viaje.destino}) - {new Date(viaje.fecha_salida).toLocaleDateString()} {viaje.hora_salida} - Asientos: {viaje.asientos_disponibles}
                                        {viaje.nombre_conductor ? ` (Conductor: ${viaje.nombre_conductor})` : ''}
                                    </option>
                                ))}
                            </>
                        ) : (
                            <option value="">No hay viajes disponibles</option>
                        )}
                    </select>
                    {viajesDisponibles.length === 0 && (
                        <p className="text-sm text-red-500 mt-2">No hay viajes disponibles para reservar en este momento.</p>
                    )}
                </div>

                <div>
                    <label htmlFor="numeroAsientos" className="block text-sm font-medium text-gray-700">Número de Asientos:</label>
                    <input
                        type="number"
                        id="numeroAsientos"
                        name="numeroAsientos"
                        value={numeroAsientos}
                        onChange={(e) => setNumeroAsientos(e.target.value)}
                        required
                        min="1"
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                    />
                    {selectedViajeId && (
                        <p className="text-xs text-gray-500 mt-1">
                            Asientos disponibles para este viaje: {viajesDisponibles.find(v => v.id === parseInt(selectedViajeId, 10))?.asientos_disponibles || 0}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-md shadow-md transition duration-300 ease-in-out"
                    disabled={!selectedViajeId || viajesDisponibles.length === 0 || !numeroAsientos || parseInt(numeroAsientos, 10) <= 0} // Deshabilita si no hay viaje seleccionado, no hay viajes, o asientos inválidos
                >
                    Reservar
                </button>
            </form>

            {mensajeReserva && (
                <p className={`mt-4 p-3 rounded-md text-sm ${mensajeReserva.includes('éxito') ? 'bg-green-100 text-green-700 border border-green-400' : 'bg-red-100 text-red-700 border border-red-400'}`}>
                    {mensajeReserva}
                </p>
            )}
        </div>
    );
}

export default Reserva;
