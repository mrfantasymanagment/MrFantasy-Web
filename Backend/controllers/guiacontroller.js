const db = require('../config/database');

const obtenerPlugins = async (req, res) => {
    const [Plugins] = await db.query('SELECT * FROM plugins ORDER BY Nombre ASC');
    res.json(plugins);
};

module.exports = { obtenerPlugins };