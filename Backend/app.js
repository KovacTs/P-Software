const express = require('express');
const path = require('path');
const { Client } = require('pg'); // Librería de PostgreSQL
const bcrypt = require('bcryptjs'); //libreria para a encriptacion de datos, tales como contraseñas

const app = express();

// Servidor escucha en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});


// Middleware para parsear JSON
app.use(express.json()); // Ya no necesitas body-parser separado si usas esta línea

// Configurar la carpeta `frontend/` como estática para servir archivos
app.use(express.static(path.join(__dirname, '../frontend/public')));

// Rutas específicas para archivos en la subcarpeta `public/`
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/Inicio.html'));
});

app.get('/Crear-cuenta', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/sign-up.html'));
});
app.get('/Iniciar-sesion', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/log-in.html'));
});
app.get('/MoneyWase', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/public/Panel.html'));
});


// Configuración de la conexión a la base de datos PostgreSQl
const client = new Client({
  user: 'postgres', // usuario que creaste
  host: 'localhost',
  database: 'MoneyWase', // nombre de tu base de datos                                 (CAMBIAR BASE DE DATOS)
  password: '302242', // contraseña que configuraste
  port: 5432, // puerto predeterminado de PostgreSQL
});
// Verificar la conexión
client.connect((err) => {
  if (err) {
    console.error('Error al conectar a PostgreSQL:', err);
  } else {
    console.log('Conexión exitosa a PostgreSQL');
  }
});


// Rutas para interactuar con la base de datos
app.post('/Crear-cuenta', async (req, res) => {
  const { name, lastname, email, password, confirmPassword } = req.body;
  console.log('Solicitud recibida en el backend con estos datos:', req.body); //ELIMINAR MÁS ADELANTE
  // Verificar que las contraseñas coincidan
  if (password !== confirmPassword) {
    return res.status(400).json({ message: 'Las contraseñas no coinciden.' });
  }
  try {
    // Encriptar la contraseña usando bcryptjs
    const hashedPassword = await bcrypt.hash(password, 10); // 10 = número de salt rounds
    // Crear un nuevo usuario en la base de datos
    await client.query('INSERT INTO public.usuarios (nombre, apellido, correo, contrasena) VALUES ($1, $2, $3, $4)', [name, lastname, email, hashedPassword]);
    //res.send('Usuario registrado exitosamente con bcryptjs');
    console.log('Usuario registrado exitosamente con bcryptjs');
  } catch (error) {
    //res.status(500).send('Error al registrar usuario');
    console.log('Error al registrar usuario');
  }
});

app.post('/Iniciar-sesion', async (req, res) => {
  const { email, password } = req.body;

  try {
    const result = await client.query('SELECT * FROM users WHERE email = $1', [email]);

    if (result.rows.length > 0) {
      // Comparar la contraseña ingresada con la encriptada en la base de datos
      const isValid = await bcrypt.compare(password, result.rows[0].password);
      if (isValid) {
        res.send('Inicio de sesión exitoso con bcryptjs');
      } else {
        res.status(401).send('Contraseña incorrecta');
      }
    } else {
      res.status(404).send('Usuario no encontrado');
    }
  } catch (error) {
    res.status(500).send('Error al iniciar sesión');
  }
});


