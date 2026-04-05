const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();


// Middlewares
app.use(cors({
    origin: ['https://mrfantasymanagment.github.io', 'http://127.0.0.1:5500', 'http://localhost:5500']
}));
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Ruta de prueba para UptimeRobot
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});

// Middlewares
app.use(cors({
    origin: ['https://mrfantasymanagment.github.io', 'http://127.0.0.1:5500', 'http://localhost:5500']
}));
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

// Ruta de prueba para UptimeRobot
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});