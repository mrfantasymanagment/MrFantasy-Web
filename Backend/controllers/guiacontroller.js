const db = require('../config/database');

const obtenerPlugins = async (req, res) => {
    const [plugins] = await db.query('SELECT * FROM Plugins ORDER BY Nombre ASC');
    res.json(plugins);
};

module.exports = { obtenerPlugins };


//Creacion de Archivos .html, .css y .js

