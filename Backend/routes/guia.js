const express = require('express');
const router = express.Router();
const { agregarSeccion } = require('../controllers/guiacontroller');

router.post('/agregar', agregarSeccion);

const guiaRoutes = require('./routes/guia');
app.use('/guia', guiaRoutes);

module.exports = router;