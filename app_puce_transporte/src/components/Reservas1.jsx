// src/components/Reservas.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import './Horarios.css'; // Assuming Horarios.css has relevant styles for tables

function Reservas() {
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const fetchReservas = async () => {
            try {
                const response = await fetch(`${API_URL}/reservas`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Estado: ${response.status} - ${errorText}`);
                }
                const data = await response.json();
                setReservas(data);
            } catch (err) {
                setError(`Error al cargar las reservas: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchReservas();
    }, []);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
    const formatTime = (timeString) => timeString || 'N/A';
    const formatDateTime = (dateTimeString) => new Date(dateTimeString).toLocaleString();

    if (loading) return <div className="mensaje-cargando">Cargando reservas...</div>;
    if (error) return <div className="mensaje-error">{error}</div>;

    return (
        <div className="horarios-contenedor">
            <h2 className="horarios-titulo">Reservas Realizadas</h2>
            {reservas.length === 0 ? (
                <p className="mensaje-vacio">No hay reservas registradas.</p>
            ) : (
                <div className="tabla-scroll">
                    <table className="tabla">
                        <thead>
                            <tr>
                                <th>ID Reserva</th><th>ID Viaje</th><th>Estudiante</th>
                                <th>Fecha Reserva</th><th>Estado</th><th>Asientos</th>
                                <th>Ruta</th><th>Fecha Viaje</th><th>Vehículo</th>
                            </tr>
                        </thead>
                        <tbody>
                            {reservas.map((r) => (
                                <tr key={r.id}>
                                    <td>{r.id}</td>
                                    <td>{r.viaje_id}</td>
                                    <td>{r.nombre_estudiante} {r.apellido_estudiante}</td>
                                    <td>{formatDateTime(r.fecha_reserva)}</td>
                                    <td>{r.estado_reserva}</td>
                                    <td>{r.numero_asientos}</td>
                                    <td>{r.nombre_ruta} ({r.origen} a {r.destino})</td>
                                    <td>{formatDate(r.fecha_salida)} {formatTime(r.hora_salida)}</td>
                                    <td>{r.vehiculo_marca} ({r.vehiculo_placa})</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {/* Botón para volver al Home */}
            <Link to="/dashboard" className="nav-link blue">
                Home
            </Link>
        </div>
    );
}

export default Reservas;