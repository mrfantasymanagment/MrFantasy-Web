const db = require('../config/database');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Registro con nickname y contraseña
const registrar = async (req, res) => {
    const { nickname, contrasena } = req.body;

    if (!nickname || !contrasena) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        const hash = await bcrypt.hash(contrasena, 10);
        await db.execute(
            'INSERT INTO usuarios (nickname, contrasena, metodo_login) VALUES (?, ?, ?)',
            [nickname, hash, 'nickname']
        );
        res.json({ mensaje: 'Usuario registrado correctamente' });
    } catch (error) {
        console.log(Error);
        if (error.code === 'ER_DUP_ENTRY') {
            return res.status(400).json({ error: 'El nickname ya existe' });
        }
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// Login con nickname y contraseña
const login = async (req, res) => {
    const { nickname, contrasena } = req.body;

    if (!nickname || !contrasena) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        const [rows] = await db.execute(
            'SELECT * FROM usuarios WHERE nickname = ?',
            [nickname]
        );

        if (rows.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const usuario = rows[0];
        const coincide = await bcrypt.compare(contrasena, usuario.contrasena);

        if (!coincide) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        const token = jwt.sign(
            { id: usuario.id, nickname: usuario.nickname },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, nickname: usuario.nickname });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// Login con Google
const loginGoogle = async (req, res) => {
    const { email, nombre } = req.body;

    if (!email) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        const [rows] = await db.execute(
            'SELECT * FROM usuarios WHERE email = ?',
            [email]
        );

        let usuario;

        if (rows.length === 0) {
            // Usuario nuevo, lo registramos
            const [result] = await db.execute(
                'INSERT INTO usuarios (email, metodo_login) VALUES (?, ?)',
                [email, 'google']
            );
            usuario = { id: result.insertId, email, nickname: nombre };
        } else {
            usuario = rows[0];
        }

        const token = jwt.sign(
            { id: usuario.id, email: usuario.email },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, email: usuario.email });
    } catch (error) {
        res.status(500).json({ error: 'Error del servidor' });
    }
};

module.exports = { registrar, login, loginGoogle };