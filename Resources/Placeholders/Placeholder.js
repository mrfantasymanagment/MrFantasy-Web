const express = require('express');
const router = express.Router();
const { agregarSeccion } = require('../controllers/guiacontroller');

router.post('/agregar', agregarSeccion);


module.exports = router;