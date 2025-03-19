const db = require('../config/database');

const obtenerPlugins = async (req, res) => {
    const [plugins] = await db.query('SELECT * FROM Plugins ORDER BY Nombre ASC');
    res.json(plugins);
};

module.exports = { obtenerPlugins };


//Creacion de Archivos .html, .css y .js

const crearArchivosPlugin = async (req, res) => {
    const { nombre } = req.body;
    const TOKEN = process.env.GITHUB_TOKEN;
    const REPO = 'mrfantasymanagment/MrFantasy-Web';
    const BASE = `Subpages/Guia/Plugins/${nombre}`;
    const extensiones = ['html', 'css', 'js'];

    for (const ext of extensiones) {
        await fetch(`https://api.github.com/repos/${REPO}/contents/${BASE}/${nombre}.${ext}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `add: archivos ${nombre}`,
                content: Buffer.from('').toString('base64')
            })
        });
    }

    res.json({ ok: true });
};

module.exports = { obtenerPlugins, crearArchivosPlugin };