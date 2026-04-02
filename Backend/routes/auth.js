const express = require('express');
const router = express.Router();
const { registrar, login, loginGoogle } = require('../controllers/authcontroller');

router.post('/registrar', registrar);
router.post('/login', login);
router.post('/google', loginGoogle);

module.exports = router;