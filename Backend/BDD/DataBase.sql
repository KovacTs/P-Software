CREATE DATABASE "Moneywase";

CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  nombre VARCHAR(50),
  apellido VARCHAR(50),
  correo VARCHAR(100) UNIQUE,
  password TEXT  -- Solo necesitas almacenar la contraseña cifrada
);
