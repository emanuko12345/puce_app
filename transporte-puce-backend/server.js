// transporte-puce-backend/server.js

// Importa los módulos necesarios
const express = require('express');
const { Pool } = require('pg'); // Cliente de PostgreSQL para Node.js
const cors = require('cors'); // Para permitir solicitudes desde tu frontend React
const bcrypt = require('bcryptjs'); // Para hashear contraseñas
const multer = require('multer'); // Importa multer para manejar la subida de archivos
const path = require('path'); // Para manejar rutas de archivos
const fs = require('fs'); // Para manejar el sistema de archivos (crear directorios y eliminar)
require('dotenv').config(); // Para cargar variables de entorno desde un archivo .env

const app = express();
const port = process.env.PORT || 5002; // Puerto para tu servidor backend, por defecto 5000

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

// --- Configuración de Multer para la subida de imágenes ---
// Directorio donde se guardarán las fotos de perfil
const uploadsDir = path.join(__dirname, 'uploads', 'profile_pictures');
// Asegúrate de que el directorio exista. Si no, créalo.
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configuración de almacenamiento de Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadsDir); // Directorio donde se guardarán los archivos
    },
    filename: (req, file, cb) => {
        // Genera un nombre de archivo único para evitar colisiones
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        // Usa el ID del usuario (de los parámetros de la URL) y la extensión original
        const userId = req.params.id; // Obtenemos el ID del usuario de los parámetros de la URL
        const fileExtension = path.extname(file.originalname);
        cb(null, `${userId}-${uniqueSuffix}${fileExtension}`);
    }
});

// Filtro para aceptar solo imágenes
const fileFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
        cb(null, true);
    } else {
        cb(new Error('Solo se permiten archivos de imagen!'), false);
    }
};

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Límite de 5MB por archivo
    fileFilter: fileFilter
});

// Sirve los archivos estáticos desde el directorio 'uploads'
// Esto permite que el frontend acceda a las imágenes subidas
// Ejemplo: http://localhost:5000/uploads/profile_pictures/1-123456789.jpg
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


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

// Ruta: Obtener todos los usuarios (Alineado con tu esquema de 'usuarios')
app.get('/api/usuarios', async (req, res) => {
    try {
        // Incluye la nueva columna 'foto_perfil_url' en la consulta
        const result = await pool.query('SELECT id, nombre, apellido, email, rol, telefono, fecha_registro, foto_perfil_url FROM usuarios ORDER BY id ASC');
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener usuarios:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener usuarios.' });
    }
});

// Ruta: Registrar un nuevo usuario (Alineado con tu esquema de 'usuarios')
app.post('/api/usuarios/registro', async (req, res) => {
    const { nombre, apellido, email, contrasena, rol, telefono } = req.body;

    if (!nombre || !apellido || !email || !contrasena) {
        return res.status(400).json({ error: 'Todos los campos obligatorios (nombre, apellido, email, contraseña) deben ser proporcionados.' });
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

// Ruta: Inicio de sesión de usuario (Alineado con tu esquema de 'usuarios')
app.post('/api/usuarios/login', async (req, res) => {
    const { email, contrasena } = req.body;

    if (!email || !contrasena) {
        return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
    }

    try {
        // Buscar el usuario por email e incluir la foto_perfil_url
        const result = await pool.query('SELECT id, nombre, apellido, email, contrasena, rol, telefono, fecha_registro, foto_perfil_url FROM usuarios WHERE email = $1', [email]);
        const user = result.rows[0];

        if (!user) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Comparar la contraseña proporcionada con la contraseña hasheada en la BD
        const isMatch = await bcrypt.compare(contrasena, user.contrasena);

        if (!isMatch) {
            return res.status(401).json({ error: 'Credenciales inválidas.' });
        }

        // Excluir la contraseña del objeto de respuesta antes de enviarlo al frontend
        const { contrasena: _, ...userData } = user;

        res.status(200).json({
            message: 'Inicio de sesión exitoso!',
            usuario: userData
        });

    } catch (err) {
        console.error('Error en el inicio de sesión:', err);
        res.status(500).json({ error: 'Error interno del servidor durante el inicio de sesión.' });
    }
});

// --- RUTA: Subir foto de perfil para un usuario específico ---
// 'profilePicture' es el nombre del campo esperado en el FormData del frontend
app.post('/api/usuarios/:id/profile-picture', upload.single('profilePicture'), async (req, res) => {
    const userId = req.params.id;

    if (!req.file) {
        return res.status(400).json({ error: 'No se ha proporcionado ningún archivo de imagen.' });
    }

    const profilePictureUrl = `/uploads/profile_pictures/${req.file.filename}`;

    try {
        // Antes de actualizar, busca la URL de la foto anterior para eliminarla
        const oldPicResult = await pool.query('SELECT foto_perfil_url FROM usuarios WHERE id = $1', [userId]);
        const oldPicUrl = oldPicResult.rows[0]?.foto_perfil_url;

        if (oldPicUrl) {
            // Construir la ruta absoluta al archivo anterior
            const oldPicPath = path.join(__dirname, oldPicUrl);
            // Verificar si el archivo existe antes de intentar eliminarlo
            if (fs.existsSync(oldPicPath)) {
                fs.unlink(oldPicPath, (err) => {
                    if (err) console.error('Error al eliminar la foto anterior:', err);
                });
            } else {
                console.warn(`La foto anterior no se encontró en el disco: ${oldPicPath}`);
            }
        }

        const result = await pool.query(
            'UPDATE usuarios SET foto_perfil_url = $1 WHERE id = $2 RETURNING id, nombre, email, foto_perfil_url',
            [profilePictureUrl, userId]
        );

        if (result.rows.length === 0) {
            // Si no se encontró el usuario, elimina el archivo subido para evitar archivos huérfanos
            fs.unlink(req.file.path, (err) => {
                if (err) console.error('Error al eliminar archivo no asociado:', err);
            });
            return res.status(404).json({ error: 'Usuario no encontrado.' });
        }

        res.status(200).json({
            message: 'Foto de perfil actualizada exitosamente.',
            profilePictureUrl: profilePictureUrl,
            usuario: result.rows[0]
        });

    } catch (err) {
        console.error('Error al actualizar la foto de perfil en la BD:', err);
        // Si hay un error en la BD, elimina el archivo subido para evitar archivos huérfanos
        fs.unlink(req.file.path, (errUnlink) => {
            if (errUnlink) console.error('Error al eliminar archivo tras fallo en BD:', errUnlink);
        });
        res.status(500).json({ error: 'Error interno del servidor al actualizar la foto de perfil.' });
    }
});

// --- RUTA: Eliminar foto de perfil para un usuario específico ---
app.delete('/api/usuarios/:id/profile-picture', async (req, res) => {
    const userId = req.params.id;

    try {
        // Obtener la URL de la foto de perfil actual del usuario
        const result = await pool.query('SELECT foto_perfil_url FROM usuarios WHERE id = $1', [userId]);
        const currentPhotoUrl = result.rows[0]?.foto_perfil_url;

        if (!currentPhotoUrl) {
            return res.status(404).json({ error: 'El usuario no tiene una foto de perfil para eliminar.' });
        }

        // Construir la ruta absoluta al archivo
        // path.join(__dirname, currentPhotoUrl) es crucial para obtener la ruta correcta en el sistema de archivos
        const filePath = path.join(__dirname, currentPhotoUrl);

        // Eliminar el archivo físico del servidor
        // Añadimos una comprobación fs.existsSync antes de fs.unlink
        if (fs.existsSync(filePath)) {
            fs.unlink(filePath, async (err) => {
                if (err) {
                    console.error('Error al eliminar el archivo físico de la foto de perfil:', err);
                    // Si el archivo no existe en el disco (ej. ya fue borrado manualmente),
                    // aún podemos limpiar la URL en la base de datos.
                    if (err.code === 'ENOENT') { // ENOENT: Error No Entry (file or directory does not exist)
                        console.warn('El archivo no se encontró en el disco, pero se intentará limpiar la URL en la DB.');
                    } else {
                        return res.status(500).json({ error: 'Error interno del servidor al eliminar el archivo.' });
                    }
                }

                // Actualizar la base de datos para establecer foto_perfil_url a NULL
                try {
                    await pool.query('UPDATE usuarios SET foto_perfil_url = NULL WHERE id = $1', [userId]);
                    res.status(200).json({ message: 'Foto de perfil eliminada exitosamente.' });
                } catch (dbErr) {
                    console.error('Error al actualizar la BD después de eliminar la foto:', dbErr);
                    res.status(500).json({ error: 'Error interno del servidor al actualizar la base de datos.' });
                }
            });
        } else {
            console.warn(`El archivo no se encontró en el disco: ${filePath}. Se procederá a limpiar la URL en la DB.`);
            // Si el archivo no existe en el disco, simplemente limpia la URL en la DB
            try {
                await pool.query('UPDATE usuarios SET foto_perfil_url = NULL WHERE id = $1', [userId]);
                res.status(200).json({ message: 'Foto de perfil eliminada exitosamente (solo se limpió la referencia en DB).' });
            } catch (dbErr) {
                console.error('Error al actualizar la BD después de eliminar la foto (archivo no encontrado):', dbErr);
                res.status(500).json({ error: 'Error interno del servidor al actualizar la base de datos.' });
            }
        }

    } catch (err) {
        console.error('Error al procesar la solicitud de eliminación de foto de perfil:', err);
        res.status(500).json({ error: 'Error interno del servidor.' });
    }
});


app.get('/api/viajes', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                v.id,
                v.ruta_id,
                r.nombre_ruta,
                r.origen,
                r.destino,
                v.vehiculo_id,
                veh.marca AS vehiculo_marca,
                veh.modelo AS vehiculo_modelo,
                veh.placa AS vehiculo_placa,
                veh.capacidad AS vehiculo_capacidad,
                v.conductor_id,
                u.nombre AS nombre_conductor,
                v.fecha_salida,
                v.hora_salida,
                v.hora_llegada_estimada,
                v.estado AS estado_viaje,
                v.precio,
                v.asientos_disponibles
            FROM
                viajes v
            JOIN
                rutas r ON v.ruta_id = r.id
            JOIN
                vehiculos veh ON v.vehiculo_id = veh.id
            LEFT JOIN
                usuarios u ON v.conductor_id = u.id AND u.rol = 'conductor'
            WHERE
                v.asientos_disponibles > 0
            ORDER BY
                v.fecha_salida ASC, v.hora_salida ASC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener viajes:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener viajes.' });
    }
});

app.post('/api/reservas', async (req, res) => {
    const { viaje_id, estudiante_id, fecha_reserva, estado, numero_asientos } = req.body;

    if (!estudiante_id || !viaje_id || !fecha_reserva || !numero_asientos || numero_asientos <= 0) {
        return res.status(400).json({ error: 'Todos los campos obligatorios para la reserva deben ser proporcionados y el número de asientos debe ser mayor que 0.' });
    }

    let client;
    try {
        client = await pool.connect();
        await client.query('BEGIN');

        const viajeResult = await client.query(
            'SELECT asientos_disponibles FROM viajes WHERE id = $1 FOR UPDATE',
            [viaje_id]
        );

        if (viajeResult.rows.length === 0) {
            await client.query('ROLLBACK');
            return res.status(404).json({ error: 'Viaje no encontrado.' });
        }

        const { asientos_disponibles } = viajeResult.rows[0];

        if (asientos_disponibles < numero_asientos) {
            await client.query('ROLLBACK');
            return res.status(409).json({ error: `No hay suficientes asientos disponibles. Solo quedan ${asientos_disponibles}.` });
        }

        const reservaResult = await client.query(
            'INSERT INTO reservas (viaje_id, estudiante_id, fecha_reserva, estado, numero_asientos) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [viaje_id, estudiante_id, fecha_reserva, estado || 'confirmada', numero_asientos]
        );

        const nuevosAsientosDisponibles = asientos_disponibles - numero_asientos;
        await client.query(
            'UPDATE viajes SET asientos_disponibles = $1 WHERE id = $2',
            [nuevosAsientosDisponibles, viaje_id]
        );

        await client.query('COMMIT');

        res.status(201).json({
            message: 'Reserva creada exitosamente y asientos actualizados!',
            reserva: reservaResult.rows[0]
        });

    } catch (err) {
        console.error('Error al crear reserva (transacción revertida):', err);
        if (client) {
            await client.query('ROLLBACK');
        }
        res.status(500).json({ error: 'Error interno del servidor al crear la reserva.' });
    } finally {
        if (client) {
            client.release();
        }
    }
});

app.get('/api/reservas', async (req, res) => {
    try {
        const result = await pool.query(`
            SELECT
                r.id,
                r.viaje_id,
                r.estudiante_id,
                r.fecha_reserva,
                r.estado AS estado_reserva,
                r.numero_asientos,
                u.nombre AS nombre_estudiante,
                u.apellido AS apellido_estudiante,
                u.email AS email_estudiante,
                u.telefono AS telefono_estudiante,
                v.fecha_salida,
                v.hora_salida,
                v.hora_llegada_estimada,
                v.precio,
                v.asientos_disponibles AS asientos_disponibles_viaje,
                rt.nombre_ruta,
                rt.origen,
                rt.destino,
                veh.marca AS vehiculo_marca,
                veh.modelo AS vehiculo_modelo,
                veh.placa AS vehiculo_placa,
                veh.capacidad AS vehiculo_capacidad,
                cond.nombre AS nombre_conductor
            FROM
                reservas r
            JOIN
                usuarios u ON r.estudiante_id = u.id
            JOIN
                viajes v ON r.viaje_id = v.id
            JOIN
                rutas rt ON v.ruta_id = rt.id
            JOIN
                vehiculos veh ON v.vehiculo_id = veh.id
            LEFT JOIN
                usuarios cond ON v.conductor_id = cond.id AND cond.rol = 'conductor'
            ORDER BY
                r.fecha_reserva DESC
        `);
        res.json(result.rows);
    } catch (err) {
        console.error('Error al obtener reservas:', err);
        res.status(500).json({ error: 'Error interno del servidor al obtener reservas.' });
    }
});


// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor backend corriendo en http://localhost:${port}`);
});