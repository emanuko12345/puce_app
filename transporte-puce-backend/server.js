// transporte-puce-backend/server.js

// Importa los módulos necesarios
const express = require('express');
const { Pool } = require('pg'); // Cliente de PostgreSQL para Node.js
const cors = require('cors'); // Para permitir solicitudes desde tu frontend React
const bcrypt = require('bcryptjs'); // Para hashear contraseñas
require('dotenv').config(); // Para cargar variables de entorno desde un archivo .env

const app = express();
const port = process.env.PORT || 5000; // Puerto para tu servidor backend, por defecto 5000

// Configuración de la conexión a PostgreSQL usando variables de entorno
const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
});

// Middleware
app.use(cors()); // Habilita CORS para que el frontend pueda hacer solicitudes
app.use(express.json()); // Permite que Express parsee el cuerpo de las solicitudes JSON

// Prueba de conexión a la base de datos
pool.connect((err, client, release) => {
    if (err) {
        return console.error('Error al adquirir cliente de la base de datos:', err.stack);
    }
    console.log('Conectado a la base de datos PostgreSQL');
    release(); // Libera el cliente de vuelta al pool
});

// --- Rutas de la API ---

// Ruta de prueba: Raíz del servidor
app.get('/', (req, res) => {
    res.send('Servidor de la API de Transporte PUCE funcionando!');
});

// Ruta: Obtener todos los usuarios
app.get('/api/usuarios', async (req, res) => {
    try {
        const result = await pool.query('SELECT id, nombre, apellido, email, rol, telefono, fecha_registro FROM usuarios ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener usuarios.' });
    }
});

// Ruta: Registrar un nuevo usuario
app.post('/api/usuarios/registro', async (req, res) => {
    const { nombre, apellido, email, contrasena, rol, telefono } = req.body;

    if (!nombre || !apellido || !email || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos obligatorios deben ser proporcionados.' });
    }

    try {
        // Verificar si el email ya existe
        const existingUser = await pool.query('SELECT id FROM usuarios WHERE email = $1', [email]);
        if (existingUser.rows.length > 0) {
            return res.status(409).json({ error: 'El email ya está registrado.' });
        }

        // Hashear la contraseña antes de guardarla en la base de datos
        const salt = await bcrypt.genSalt(10);
        const contrasenaHasheada = await bcrypt.hash(contrasena, salt);

        const result = await pool.query(
            'INSERT INTO usuarios (nombre, apellido, email, contrasena, rol, telefono) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, nombre, apellido, email, rol, telefono, fecha_registro',
            [nombre, apellido, email, contrasenaHasheada, rol || 'estudiante', telefono] // 'estudiante' como rol por defecto
        );
        res.status(201).json({
            message: 'Usuario registrado exitosamente!',
            usuario: result.rows[0]
        });
    } catch (err) {
        console.error('Error al registrar usuario:', err);
        res.status(500).json({ error: 'Error interno del servidor al registrar usuario.' });
    }
});

// Ruta: Inicio de sesión de usuario
app.post('/api/usuarios/login', async (req, res) => {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
    }

    try {
        // Buscar el usuario por email
        const result = await pool.query('SELECT id, nombre, apellido, email, contrasena, rol FROM usuarios WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Comparar la contraseña proporcionada con la contraseña hasheada en la BD
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // En una aplicación real, aquí generarías un token JWT para la autenticación
        // Por ahora, solo devolvemos los datos del usuario (sin la contraseña hasheada)
        const { contrasena: _, ...userData } = user; // Excluir la contraseña del objeto de respuesta

        res.status(200).json({
            message: 'Inicio de sesión exitoso!',
            usuario: userData
        });

    } catch (err) {
        console.error('Error en el inicio de sesión:', err);
        res.status(500).json({ error: 'Error interno del servidor durante el inicio de sesión.' });
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});
