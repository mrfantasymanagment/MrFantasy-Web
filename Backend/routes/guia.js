const express = require('express');
const router = express.Router();
const { obtenerPlugins, crearArchivosPlugin, agregarPlugin, obtenerPluginPorNombre, modificarPlugin } = require('../controllers/guiacontroller');

router.get('/plugins', obtenerPlugins);
router.post('/crear-archivos', crearArchivosPlugin);
router.post('/agregar', agregarPlugin);
router.get('/plugin/:nombre', obtenerPluginPorNombre);
router.put('/modificar', modificarPlugin);

module.exports = router;