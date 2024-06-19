import {PORT} from "./public/config.js"

import express from 'express';
import path from 'path';
const app = express();

// Configuración para servir archivos estáticos
app.use(express.static('public'));

// Rutas
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/public/index.html');
});

app.get('/page2', (req, res) => {
    res.sendFile(__dirname + '/public/page2.html');
});

// Iniciar el servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});