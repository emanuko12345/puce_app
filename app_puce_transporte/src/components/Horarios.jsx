// src/components/Horarios.jsx
import React, { useState, useEffect } from 'react';
import './Horarios.css';

function Horarios() {
    const [viajes, setViajes] = useState([]);
    const [reservas, setReservas] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = 'http://localhost:5000/api';

    const fetchViajes = async () => {
        try {
            const response = await fetch(`${API_URL}/viajes`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP! Estado: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            setViajes(data);
        } catch (err) {
            setError(`Error al cargar los horarios de viajes: ${err.message}`);
        }
    };

    const fetchReservas = async () => {
        try {
            const response = await fetch(`${API_URL}/reservas`);
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Error HTTP! Estado: ${response.status} - ${errorText}`);
            }
            const data = await response.json();
            setReservas(data);
        } catch (err) {
            setError(`Error al cargar las reservas: ${err.message}`);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            setLoading(true);
            setError(null);
            await Promise.allSettled([fetchViajes(), fetchReservas()]);
            setLoading(false);
        };
        loadData();
    }, []);

    const formatDate = (dateString) => {
        try {
            return new Date(dateString).toLocaleDateString();
        } catch {
            return 'Fecha inválida';
        }
    };

    const formatTime = (timeString) => {
        return timeString || 'N/A';
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
        return <div className="mensaje-cargando">Cargando horarios y reservas...</div>;
    }

    if (error) {
        return <div className="mensaje-error">{error}</div>;
    }

    return (
        <div className="horarios-contenedor">
            <h2 className="horarios-titulo">Horarios y Reservas Disponibles</h2>

            <div className="seccion">
                <h3 className="seccion-titulo azul">Horarios de Viajes</h3>
                {viajes.length === 0 ? (
                    <p className="mensaje-vacio">No hay viajes programados.</p>
                ) : (
                    <div className="tabla-scroll">
                        <table className="tabla">
                            <thead>
                                <tr>
                                    <th>ID</th><th>Ruta</th><th>Origen</th><th>Destino</th>
                                    <th>Fecha</th><th>Salida</th><th>Llegada Est.</th>
                                    <th>Asientos</th><th>Conductor</th><th>Vehículo</th><th>Precio</th>
                                </tr>
                            </thead>
                            <tbody>
                                {viajes.map((v) => (
                                    <tr key={v.id}>
                                        <td>{v.id}</td>
                                        <td>{v.nombre_ruta}</td>
                                        <td>{v.origen}</td>
                                        <td>{v.destino}</td>
                                        <td>{formatDate(v.fecha_salida)}</td>
                                        <td>{formatTime(v.hora_salida)}</td>
                                        <td>{formatTime(v.hora_llegada_estimada)}</td>
                                        <td>{v.asientos_disponibles}</td>
                                        <td>{v.nombre_conductor || 'N/A'}</td>
                                        <td>{v.vehiculo_marca} {v.vehiculo_modelo} ({v.vehiculo_placa})</td>
                                        <td>{formatPrice(v.precio)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            <div className="seccion">
                <h3 className="seccion-titulo verde">Reservas Realizadas</h3>
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
            </div>
        </div>
    );
}

export default Horarios;