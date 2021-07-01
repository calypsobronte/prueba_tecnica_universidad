//Importar las librerias para iniciar 
const express = require('express');
const path = require('path');
const dotenv = require("dotenv");
const bcryptjs = require('bcryptjs');
const session = require('express-session');

const app = express(); //Inicializa el servidor

//Configuraciones
app.set('port', process.env.PORT || 3000); //Configuración de Puerto
app.set('view engine', 'ejs'); //Configurar gestor de plantillas
app.set('views', path.join(__dirname, '../app/views')); //Ruta donde están almacenadas las vistas

//Middlewares - Archivos para recibir la información de los formularios.
app.use(express.urlencoded({extended:false}));
app.use(express.json());

//Configurar la libreria para variables de entorno
dotenv.config({path:path.join(__dirname, '../env/.env')})

app.use('/resources', express.static(path.join(__dirname, '../public')));

//Configuración del manejo se session
app.use(session({
    secret: 'secret',
    resave: true,
    saveUninitialized:true
}))

module.exports = app;


