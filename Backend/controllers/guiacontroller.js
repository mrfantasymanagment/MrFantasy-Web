const db = require('../config/database');

const obtenerPlugins = async (req, res) => {
    const [plugins] = await db.query('SELECT * FROM Plugins ORDER BY Nombre ASC');
    res.json(plugins);
};


//Creacion de Archivos .html, .css y .js

const crearArchivosPlugin = async (req, res) => {
    const { nombre, imagen } = req.body;
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

    // Guardar imagen si existe
    if (imagen) {
        const base64Puro = imagen.split(',')[1]; // Quitá el prefijo data:image/...;base64,
        await fetch(`https://api.github.com/repos/${REPO}/contents/${BASE}/${nombre}.png`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `add: imagen ${nombre}`,
                content: base64Puro
            })
        });
    }

    res.json({ ok: true });
};

const agregarPlugin = async (req, res) => {
    const { nombre, descripcion, comando1, comando2, comando3, comando4, comando5, comando6, comando7, comando8, enlace } = req.body;
    
    const enlaceGenerado = `https://mrfantasymanagment.github.io/MrFantasy-Web/Subpages/Guia/Plugins/${nombre}/${nombre}.html`;
    const imagenUrl = `https://raw.githubusercontent.com/mrfantasymanagment/MrFantasy-Web/main/Subpages/Guia/Plugins/${nombre}/${nombre}.png`;

    await db.query(
        'INSERT INTO Plugins (Nombre, Descripcion, Comando1, Comando2, Comando3, Comando4, Comando5, Comando6, Comando7, Comando8, Imagen, Enlace, Url) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, comando1, comando2, comando3, comando4, comando5, comando6, comando7, comando8, imagenUrl, enlaceGenerado, enlace]
    );

    res.json({ ok: true });
};

module.exports = { obtenerPlugins, crearArchivosPlugin, agregarPlugin };