import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './Reserva.css';

function Reserva({ usuarioLogeado }) {
    const [viajesDisponibles, setViajesDisponibles] = useState([]);
    const [selectedViajeId, setSelectedViajeId] = useState('');
    const [numeroAsientos, setNumeroAsientos] = useState('');
    const [mensajeReserva, setMensajeReserva] = useState('');

    const navigate = useNavigate();
    const API_URL = 'http://localhost:5000/api';

    const fetchViajesDisponibles = async () => {
        try {
            const response = await fetch(`${API_URL}/viajes`);
            if (!response.ok) throw new Error(`Error HTTP! Estado: ${response.status}`);
            const data = await response.json();
            setViajesDisponibles(data);
            setSelectedViajeId(data.length > 0 ? data[0].id : '');
        } catch (error) {
            console.error("Error al obtener viajes disponibles:", error);
            setMensajeReserva('Error al cargar los viajes disponibles.');
        }
    };

    useEffect(() => {
        fetchViajesDisponibles();
    }, []);

    const handleReservaSubmit = async (e) => {
        e.preventDefault();
        setMensajeReserva('');

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

        const viajeSeleccionado = viajesDisponibles.find(viaje => viaje.id === parseInt(selectedViajeId, 10));
        if (!viajeSeleccionado) {
            setMensajeReserva('El viaje seleccionado no es válido o no está disponible.');
            return;
        }

        if (asientosAReservar > viajeSeleccionado.asientos_disponibles) {
            setMensajeReserva(`Solo quedan ${viajeSeleccionado.asientos_disponibles} asientos disponibles.`);
            return;
        }

        const fechaReservaTimestamp = `${viajeSeleccionado.fecha_salida.split('T')[0]}T${viajeSeleccionado.hora_salida}`;
        const nuevaReserva = {
            estudiante_id: usuarioLogeado.id,
            viaje_id: parseInt(selectedViajeId, 10),
            fecha_reserva: fechaReservaTimestamp,
            estado: 'confirmada',
            numero_asientos: asientosAReservar,
        };

        try {
            const response = await fetch(`${API_URL}/reservas`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(nuevaReserva),
            });

            const data = await response.json();
            if (!response.ok) throw new Error(data.error || `Error HTTP! Estado: ${response.status}`);

            setMensajeReserva(`Reserva de ${data.reserva.numero_asientos} asientos para el Viaje ID: ${data.reserva.viaje_id} realizada con éxito!`);
            setNumeroAsientos('');
            fetchViajesDisponibles();
        } catch (error) {
            console.error("Error al realizar la reserva:", error);
            setMensajeReserva(`Error al realizar la reserva: ${error.message}`);
        }
    };

    return (
        <div className="reserva-container">
            <h2 className="reserva-title">Realizar Reserva</h2>
            <p className="reserva-subtitle">Selecciona un viaje disponible y la cantidad de asientos que deseas reservar.</p>

            <form onSubmit={handleReservaSubmit} className="reserva-form">
                <div>
                    <label htmlFor="selectViaje">Seleccionar Viaje:</label>
                    <select
                        id="selectViaje"
                        value={selectedViajeId}
                        onChange={(e) => setSelectedViajeId(e.target.value)}
                        required
                    >
                        {viajesDisponibles.length > 0 ? (
                            <>
                                <option value="">-- Selecciona un viaje --</option>
                                {viajesDisponibles.map((viaje) => (
                                    <option key={viaje.id} value={viaje.id}>
                                        {viaje.nombre_ruta} ({viaje.origen} a {viaje.destino}) - {new Date(viaje.fecha_salida).toLocaleDateString()} {viaje.hora_salida} - Asientos: {viaje.asientos_disponibles}
                                        {viaje.nombre_conductor ? ` (Conductor: ${viaje.nombre_conductor})` : ''}
                                    </option>
                                ))}
                            </>
                        ) : (
                            <option value="">No hay viajes disponibles</option>
                        )}
                    </select>
                </div>

                <div>
                    <label htmlFor="numeroAsientos">Número de Asientos:</label>
                    <input
                        type="number"
                        id="numeroAsientos"
                        value={numeroAsientos}
                        onChange={(e) => setNumeroAsientos(e.target.value)}
                        min="1"
                        required
                    />
                    {selectedViajeId && (
                        <p className="disponibles-text">
                            Asientos disponibles: {viajesDisponibles.find(v => v.id === parseInt(selectedViajeId, 10))?.asientos_disponibles || 0}
                        </p>
                    )}
                </div>

                <button
                    type="submit"
                    className="reserva-button"
                    disabled={!selectedViajeId || !numeroAsientos || parseInt(numeroAsientos, 10) <= 0}
                >
                    Reservar
                </button>
            </form>

            {mensajeReserva && (
                <p className={`reserva-mensaje ${mensajeReserva.includes('éxito') ? 'success' : 'error'}`}>
                    {mensajeReserva}
                </p>
            )}

            {/* Botón para volver al Home */}
            <Link to="/dashboard" className="nav-link blue">
                Home
            </Link>
        </div>
    );
}

export default Reserva;