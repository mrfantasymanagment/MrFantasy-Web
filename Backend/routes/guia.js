const express = require('express');
const router = express.Router();
const { obtenerPlugins } = require('../controllers/guiacontroller');

router.get('/plugins', obtenerPlugins);

module.exports = router;