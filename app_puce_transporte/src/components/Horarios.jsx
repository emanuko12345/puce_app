// src/components/Horarios.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // ⬅️ Importa Link
import './Horarios.css';

function Horarios() {
    const [viajes, setViajes] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const API_URL = 'http://localhost:5000/api';

    useEffect(() => {
        const fetchViajes = async () => {
            try {
                const response = await fetch(`${API_URL}/viajes`);
                if (!response.ok) {
                    const errorText = await response.text();
                    throw new Error(`Estado: ${response.status} - ${errorText}`);
                }
                const data = await response.json();
                setViajes(data);
            } catch (err) {
                setError(`Error al cargar los horarios: ${err.message}`);
            } finally {
                setLoading(false);
            }
        };
        fetchViajes();
    }, []);

    const formatDate = (dateString) => new Date(dateString).toLocaleDateString();
    const formatTime = (timeString) => timeString || 'N/A';
    const formatPrice = (price) => `$${parseFloat(price).toFixed(2)}`;

    if (loading) return <div className="mensaje-cargando">Cargando horarios...</div>;
    if (error) return <div className="mensaje-error">{error}</div>;

    return (
        <div className="horarios-contenedor">
            
          
            <h2 className="horarios-titulo">Horarios de Viajes</h2>
            
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
  {/* Botón para volver al Home */}
            <Link to="/dashboard" className="nav-link blue">
                            Home
                          </Link>



        </div>
    );
}

export default Horarios;