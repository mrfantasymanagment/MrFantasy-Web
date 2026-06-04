const db = require('../config/database');
const jwt = require('jsonwebtoken');

// Login con Google
const loginGoogle = async (req, res) => {
    const { nombre, proveedor_id } = req.body;

    if (!nombre || !proveedor_id) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        const [rows] = await db.execute(
            'SELECT * FROM usuarios WHERE proveedor = ? AND proveedor_id = ?',
            ['google', proveedor_id]
        );

        let usuario;

        if (rows.length === 0) {
            // Usuario nuevo
            const [result] = await db.execute(
                'INSERT INTO usuarios (nickname, proveedor, proveedor_id) VALUES (?, ?, ?)',
                [nombre, 'google', proveedor_id]
            );
            usuario = { id: result.insertId, nickname: nombre, Rango: 'User' };
        } else {
            usuario = rows[0];
        }

        const token = jwt.sign(
            { id: usuario.id, nickname: usuario.nickname, rango: usuario.Rango },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, nickname: usuario.nickname, rango: usuario.Rango });
    } catch (error) {
        console.error('Error en loginGoogle:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

// Login con Discord
const loginDiscord = async (req, res) => {
    const { code } = req.body;

    if (!code) {
        return res.status(400).json({ error: 'Faltan datos' });
    }

    try {
        // Intercambiamos el code por un token
        const tokenRes = await fetch('https://discord.com/api/oauth2/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                client_id: process.env.DISCORD_CLIENT_ID,
                client_secret: process.env.DISCORD_CLIENT_SECRET,
                grant_type: 'authorization_code',
                code,
                redirect_uri: process.env.DISCORD_REDIRECT_URI
            })
        });

        const tokenData = await tokenRes.json();
        if (!tokenData.access_token) {
            return res.status(401).json({ error: 'Token de Discord inválido' });
        }

        // Obtenemos los datos del usuario
        const userRes = await fetch('https://discord.com/api/users/@me', {
            headers: { Authorization: `Bearer ${tokenData.access_token}` }
        });

        const discordUser = await userRes.json();

        const [rows] = await db.execute(
            'SELECT * FROM usuarios WHERE proveedor = ? AND proveedor_id = ?',
            ['discord', discordUser.id]
        );

        let usuario;

        if (rows.length === 0) {
            // Usuario nuevo
            const [result] = await db.execute(
                'INSERT INTO usuarios (nickname, proveedor, proveedor_id) VALUES (?, ?, ?)',
                [discordUser.username, 'discord', discordUser.id]
            );
            usuario = { id: result.insertId, nickname: discordUser.username, Rango: 'User' };
        } else {
            usuario = rows[0];
        }

        const token = jwt.sign(
            { id: usuario.id, nickname: usuario.nickname, rango: usuario.Rango },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, nickname: usuario.nickname, rango: usuario.Rango });
    } catch (error) {
        console.error('Error en loginDiscord:', error);
        res.status(500).json({ error: 'Error del servidor' });
    }
};

module.exports = { loginGoogle, loginDiscord };