const express = require('express');
const path = require('path');
const { Client } = require('pg'); // Librería de PostgreSQL
const bcrypt = require('bcryptjs'); //libreria para a encriptacion de datos, tales como contraseñas
const session = require('express-session');


const app = express();

// Servidor escucha en el puerto 3000
app.listen(3000, () => {
  console.log('Servidor corriendo en http://localhost:3000');
});


// Configurar express-session 
//(verificar si este es la fuente del problema de Redireccionamiento al vista MoneyWase)
app.use(
  session({
    secret: 'mi_secreto_super_seguro',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false, maxAge: 60000 } // maxAge: tiempo en milisegundos (ejemplo: 1 minuto = 60000)
  })
);


// Middleware para parsear JSON
app.use(express.json()); // Ya no necesitas body-parser separado si usas esta línea

// Configurar la carpeta `frontend/` como estática para servir archivos
app.use(express.static(path.join(__dirname, '../frontend')));

// Rutas específicas para archivos en la subcarpeta `public/`
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/Inicio.html'));
});
app.get('/Crear-cuenta', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/sign-up.html'));
});
app.get('/Iniciar-sesion', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/log-in.html'));
});


// Configuración de la conexión a la base de datos PostgreSQl
const client = new Client({
  user: 'postgres', // usuario que creaste
  host: 'localhost',
  database: 'MoneyWase', // nombre de tu base de datos   
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
    console.log(name, lastname, email, hashedPassword);
    await client.query('INSERT INTO public.users (name, lastname, email, password) VALUES ($1, $2, $3, $4)', [name, lastname, email, hashedPassword]);
    //res.send('Usuario registrado exitosamente con bcryptjs');
    console.log('Usuario registrado exitosamente con bcryptjs');
  } catch (error) {
    //res.status(500).send('Error al registrar usuario');
    console.log('Error al registrar usuario');
  }
});

// Función para obtener el usuario desde la base de datos
async function getUserFromDatabase(email) {
  console.log("Entrando a getUserFromDatabase");
  try {
    const result = await client.query('SELECT * FROM public.users WHERE email = $1', [email]);
    return result.rows[0];  // Devolver el primer usuario encontrado (si existe)
  } catch (error) {
    console.error('Error consultando la base de datos:', error);
    throw error;
  }
}

app.post('/Iniciar-sesion', async (req, res) => {
  const { email, password } = req.body;

  try {
    console.log("Antes de llamar a getUserFromDatabase");
    const user = await getUserFromDatabase(email);
    console.log("Después de llamar a getUserFromDatabase");

    if (!user) {
      return res.status(404).json({ success: false, message: 'Usuario no encontrado' });
    }

    const match = await bcrypt.compare(password, user.password);

    if (!match) {
      return res.status(401).json({ success: false, message: 'Contraseña incorrecta' });
    }

    // Iniciar la sesión y enviar la respuesta de éxito
    req.session.user = user;
    console.log('Redirecting to /MoneyWase')
    return res.redirect('/MoneyWase');
    //return res.json({ success: true, redirectUrl: '/MoneyWase' });
  } catch (error) {
    console.error('Error al iniciar sesión:', error);
    return res.status(500).json({ success: false, message: 'Error en el servidor' });
  }

});

// Ruta protegida para el software principal
app.get('/MoneyWase', (req, res) => {
  
  if (req.session.user) {
    
     return res.sendFile(path.join(__dirname, '../frontend/MoneyWase.html'));
  } else {
    return res.redirect('/');//  Redireccionar al metodo iniciar  sesion
  }
});
