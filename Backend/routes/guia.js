const express = require('express');
const router = express.Router();
const { obtenerPlugins } = require('../controllers/guiacontroller');
const { obtenerPlugins, crearArchivosPlugin } = require('../controllers/guiacontroller');

router.get('/plugins', obtenerPlugins);
router.post('/crear-archivos', crearArchivosPlugin);

module.exports = router;

