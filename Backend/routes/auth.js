const express = require('express');
const router = express.Router();
const { loginGoogle, loginDiscord } = require('../controllers/authcontroller');

router.post('/google', loginGoogle);
router.post('/discord', loginDiscord);

module.exports = router;