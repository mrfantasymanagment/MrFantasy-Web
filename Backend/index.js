const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();

app.use(express.json({ limit: '10mb' }));

// Middlewares
app.use(cors({
    origin: ['https://mrfantasymanagment.github.io', 'http://127.0.0.1:5501', 'http://127.0.0.1:9000', 'http://localhost:5501', 'http://localhost:9000']
}));
app.use(express.json());

// Rutas
const authRoutes = require('./routes/auth');
app.use('/auth', authRoutes);

const guiaRoutes = require('./routes/guia');
app.use('/guia', guiaRoutes);

// Ruta de prueba para UptimeRobot
app.get('/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Iniciar servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Servidor corriendo en puerto ${PORT}`);
});