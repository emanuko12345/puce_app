// src/components/CrearViaje.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './CrearViaje.css';

function CrearViaje({ usuarioLogeado }) {
  const navigate = useNavigate();
  const API_URL = 'http://localhost:5000/api';

  // Estado del formulario para crear un viaje
  const [formData, setFormData] = useState({
    nombre_ruta: '',
    origen: '',
    destino: '',
    marca: '',
    modelo: '',
    placa: '',
    capacidad: '',
    fecha_salida: '',
    hora_salida: '',
    hora_llegada_estimada: '',
    precio: '',
    asientos_disponibles: '',
    conductor_id: usuarioLogeado?.id || null, // Se establece el ID del conductor logeado
  });

  // Estado para mensajes de feedback
  const [mensaje, setMensaje] = useState('');

  // Efecto para verificar el rol del usuario al montar el componente
  useEffect(() => {
    // Si no hay un usuario logeado o no es un conductor, redirecciona
    if (!usuarioLogeado || usuarioLogeado.rol !== 'conductor') {
      navigate('/dashboard');
    }
  }, [usuarioLogeado, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje('');

    // Validación básica de los datos del formulario
    const { nombre_ruta, origen, destino, marca, modelo, placa, capacidad, fecha_salida, hora_salida, precio, asientos_disponibles } = formData;
    if (!nombre_ruta || !origen || !destino || !marca || !modelo || !placa || !capacidad || !fecha_salida || !hora_salida || !precio || !asientos_disponibles) {
      setMensaje('Por favor, completa todos los campos obligatorios.');
      return;
    }

    try {
      // 1. Crear o encontrar la ruta
      let rutaId;
      const rutaResponse = await fetch(`${API_URL}/rutas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nombre_ruta, origen, destino })
      });
      const rutaData = await rutaResponse.json();
      if (!rutaResponse.ok) {
        throw new Error(rutaData.error || 'Error al crear/obtener la ruta');
      }
      rutaId = rutaData.ruta.id;

      // 2. Crear o encontrar el vehículo
      let vehiculoId;
      const vehiculoResponse = await fetch(`${API_URL}/vehiculos`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ marca, modelo, placa, capacidad })
      });
      const vehiculoData = await vehiculoResponse.json();
      if (!vehiculoResponse.ok) {
        throw new Error(vehiculoData.error || 'Error al crear/obtener el vehículo');
      }
      vehiculoId = vehiculoData.vehiculo.id;

      // 3. Crear el viaje
      const viajePayload = {
        ruta_id: rutaId,
        vehiculo_id: vehiculoId,
        conductor_id: formData.conductor_id,
        fecha_salida: formData.fecha_salida,
        hora_salida: formData.hora_salida,
        hora_llegada_estimada: formData.hora_llegada_estimada,
        precio: formData.precio,
        asientos_disponibles: formData.asientos_disponibles,
      };

      const viajeResponse = await fetch(`${API_URL}/viajes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(viajePayload)
      });

      const viajeData = await viajeResponse.json();
      if (!viajeResponse.ok) {
        throw new Error(viajeData.error || `HTTP error! status: ${viajeResponse.status}`);
      }

      setMensaje(`Viaje registrado exitosamente! ID: ${viajeData.viaje.id}`);
      setFormData({
        nombre_ruta: '',
        origen: '',
        destino: '',
        marca: '',
        modelo: '',
        placa: '',
        capacidad: '',
        fecha_salida: '',
        hora_salida: '',
        hora_llegada_estimada: '',
        precio: '',
        asientos_disponibles: '',
        conductor_id: usuarioLogeado?.id,
      });

      setTimeout(() => {
        navigate('/dashboard');
      }, 3000);

    } catch (error) {
      console.error("Error al crear viaje:", error);
      setMensaje(`Error al crear viaje: ${error.message}`);
    }
  };

  return (
    <div className="crear-viaje-container">
      <h1 className="crear-viaje-title">Registrar Nuevo Viaje</h1>
      <form onSubmit={handleSubmit} className="crear-viaje-form">
        
        <h2>Datos de la Ruta</h2>
        <div className="form-group">
          <label htmlFor="nombre_ruta">Nombre de la Ruta:</label>
          <input
            type="text"
            id="nombre_ruta"
            name="nombre_ruta"
            value={formData.nombre_ruta}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="origen">Origen:</label>
          <input
            type="text"
            id="origen"
            name="origen"
            value={formData.origen}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="destino">Destino:</label>
          <input
            type="text"
            id="destino"
            name="destino"
            value={formData.destino}
            onChange={handleChange}
            required
          />
        </div>

        <hr />

        <h2>Datos del Vehículo</h2>
        <div className="form-group">
          <label htmlFor="marca">Marca:</label>
          <input
            type="text"
            id="marca"
            name="marca"
            value={formData.marca}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="modelo">Modelo:</label>
          <input
            type="text"
            id="modelo"
            name="modelo"
            value={formData.modelo}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="placa">Placa:</label>
          <input
            type="text"
            id="placa"
            name="placa"
            value={formData.placa}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="capacidad">Capacidad:</label>
          <input
            type="number"
            id="capacidad"
            name="capacidad"
            value={formData.capacidad}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <hr />

        <h2>Datos del Viaje</h2>
        <div className="form-group">
          <label htmlFor="fecha_salida">Fecha de Salida:</label>
          <input
            type="date"
            id="fecha_salida"
            name="fecha_salida"
            value={formData.fecha_salida}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="hora_salida">Hora de Salida:</label>
          <input
            type="time"
            id="hora_salida"
            name="hora_salida"
            value={formData.hora_salida}
            onChange={handleChange}
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="hora_llegada_estimada">Hora de Llegada Estimada:</label>
          <input
            type="time"
            id="hora_llegada_estimada"
            name="hora_llegada_estimada"
            value={formData.hora_llegada_estimada}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label htmlFor="precio">Precio:</label>
          <input
            type="number"
            id="precio"
            name="precio"
            value={formData.precio}
            onChange={handleChange}
            step="0.01"
            min="0"
            required
          />
        </div>
        <div className="form-group">
          <label htmlFor="asientos_disponibles">Asientos Disponibles:</label>
          <input
            type="number"
            id="asientos_disponibles"
            name="asientos_disponibles"
            value={formData.asientos_disponibles}
            onChange={handleChange}
            min="1"
            required
          />
        </div>

        <button type="submit" className="crear-viaje-button">Registrar Viaje</button>
      </form>

      {mensaje && <p className="mensaje-feedback">{mensaje}</p>}
    </div>
  );
}

export default CrearViaje;
