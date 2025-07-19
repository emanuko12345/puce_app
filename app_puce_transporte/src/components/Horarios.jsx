import React, { useState, useEffect } from 'react';

function Horarios() {
    const [viajes, setViajes] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const API_URL = 'http://localhost:5000/api';

    // Función para obtener los viajes disponibles
    const fetchViajes = async () => {
        try {
            const response = await fetch(`${API_URL}/viajes`);
            if (!response.ok) {
                const errorText = await response.text(); // Intenta leer el texto del error
                throw new Error(`Error HTTP! Estado: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            console.log("Datos de Viajes recibidos:", data); // Log para depuración
            setViajes(data);
        } catch (err) {
            console.error("Error al obtener viajes:", err);
            setError(`Error al cargar los horarios de viajes: ${err.message}`);
        }
    };

    // Función para obtener todas las reservas
    const fetchReservas = async () => {
        try {
            const response = await fetch(`${API_URL}/reservas`);
            if (!response.ok) {
                const errorText = await response.text(); // Intenta leer el texto del error
                throw new Error(`Error HTTP! Estado: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            console.log("Datos de Reservas recibidos:", data); // Log para depuración
            setReservas(data);
        } catch (err) {
            console.error("Error al obtener reservas:", err);
            setError(`Error al cargar las reservas: ${err.message}`);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            // Usamos Promise.allSettled para que ambas promesas se resuelvan,
            // incluso si una falla, y podamos ver los resultados de ambas.
            const [viajesResult, reservasResult] = await Promise.allSettled([
                fetchViajes(),
                fetchReservas()
            ]);

            // Comprobar si alguna de las llamadas falló
            if (viajesResult.status === 'rejected' || reservasResult.status === 'rejected') {
                // El error ya se habrá establecido dentro de fetchViajes/fetchReservas
                console.warn("Una o ambas llamadas de API fallaron, revisa los logs de error.");
            }
            setLoading(false);
        };
        loadData();
    }, []);

    // Helper para formatear fechas y horas de forma segura
    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return 'Fecha inválida';
        }
    };

    const formatTime = (timeString) => {
        // Asume que timeString ya está en un formato HH:MM:SS o similar
        // Si viene con milisegundos y quieres recortarlos, puedes hacer:
        // return timeString ? timeString.substring(0, 5) : 'N/A';
        return timeString || 'N/A'; // Si es nulo o vacío, muestra N/A
    };

    const formatDateTime = (dateTimeString) => {
        try {
            return new Date(dateTimeString).toLocaleString();
        } catch {
            return 'Fecha/Hora inválida';
        }
    };

    const formatPrice = (price) => {
        try {
            return `$${parseFloat(price).toFixed(2)}`;
        } catch {
            return 'N/A';
        }
    };


    if (loading) {
        return (
            <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto my-8 text-center font-inter">
                <p className="text-gray-700">Cargando horarios y reservas...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="p-6 bg-red-100 border border-red-400 text-red-700 rounded-lg shadow-md max-w-4xl mx-auto my-8 text-center font-inter">
                <p>{error}</p>
                <p className="text-sm mt-2">Por favor, verifica la consola del navegador (F12) y la terminal de tu servidor backend para más detalles.</p>
            </div>
        );
    }

    return (
        <div className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto my-8 font-inter">
            <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Horarios y Reservas Disponibles</h2>

            {/* Sección de Horarios de Viajes */}
            <div className="mb-8">
                <h3 className="text-2xl font-semibold text-blue-700 mb-4 border-b pb-2">Horarios de Viajes</h3>
                {viajes.length === 0 ? (
                    <p className="text-gray-600">No hay viajes programados disponibles en este momento.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-md">
                            <thead className="bg-blue-50">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">ID Viaje</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Ruta</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Origen</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Destino</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Fecha</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Salida</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Llegada Est.</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Asientos Disp.</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Conductor</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Vehículo</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {viajes.map((viaje) => (
                                    <tr key={viaje.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{viaje.id}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{viaje.nombre_ruta}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{viaje.origen}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{viaje.destino}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{formatDate(viaje.fecha_salida)}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{formatTime(viaje.hora_salida)}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{formatTime(viaje.hora_llegada_estimada)}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{viaje.asientos_disponibles}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{viaje.nombre_conductor || 'N/A'}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{viaje.vehiculo_marca} {viaje.vehiculo_modelo} ({viaje.vehiculo_placa})</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{formatPrice(viaje.precio)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Sección de Reservas Realizadas */}
            <div>
                <h3 className="text-2xl font-semibold text-green-700 mb-4 border-b pb-2">Reservas Realizadas</h3>
                {reservas.length === 0 ? (
                    <p className="text-gray-600">No hay reservas registradas en el sistema.</p>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="min-w-full bg-white border border-gray-200 rounded-md">
                            <thead className="bg-green-50">
                                <tr>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">ID Reserva</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">ID Viaje</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Estudiante</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Fecha Reserva</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Estado</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Asientos</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Ruta Viaje</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Fecha Viaje</th>
                                    <th className="py-2 px-4 border-b text-left text-sm font-medium text-gray-700">Vehículo Viaje</th>
                                </tr>
                            </thead>
                            <tbody>
                                {reservas.map((reserva) => (
                                    <tr key={reserva.id} className="hover:bg-gray-50">
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{reserva.id}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{reserva.viaje_id}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{reserva.nombre_estudiante} {reserva.apellido_estudiante}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{formatDateTime(reserva.fecha_reserva)}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{reserva.estado_reserva}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{reserva.numero_asientos}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{reserva.nombre_ruta} ({reserva.origen} a {reserva.destino})</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{formatDate(reserva.fecha_salida)} {formatTime(reserva.hora_salida)}</td>
                                        <td className="py-2 px-4 border-b text-sm text-gray-800">{reserva.vehiculo_marca} ({reserva.vehiculo_placa})</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Horarios;
