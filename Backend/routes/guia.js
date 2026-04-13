const express = require('express');
const router = express.Router();
const { obtenerPlugins, buscarPlugins, crearArchivosPlugin, agregarPlugin, obtenerPluginPorNombre, modificarPlugin, toggleCheckout } = require('../controllers/guiacontroller');

router.get('/plugins', obtenerPlugins);
router.get('/plugins/buscar', buscarPlugins);
router.post('/crear-archivos', crearArchivosPlugin);
router.post('/agregar', agregarPlugin);
router.get('/plugin/:nombre', obtenerPluginPorNombre);
router.put('/modificar', modificarPlugin);
router.post('/checkout', toggleCheckout);

module.exports = router;