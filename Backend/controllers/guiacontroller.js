const fs = require('fs');
const path = require('path');

const agregarSeccion = (req, res) => {
    const { nombre, descripcion, comandos, imagen, enlace } = req.body;

    const nuevaSeccion = `
    <a href="${enlace}" style="text-decoration: none;">
    <div class="Plugin_Container">
        <div class="Nombre_Campo">
            <div class="hproyectos">${nombre}</div>
        </div>
        <div class="Descripcion_Campo">
            <div class="hproyectos2">${descripcion}</div>
        </div>
        <div class="Comandos_Campo">
            <div class="hproyectos2">${comandos}</div>
        </div>
        <div class="Imagen_Campo">
            <img src="${imagen}" class="Instagram_Imagen">
        </div>
    </div>
    </a>`;

    const rutaHTML = path.join(__dirname, '../../Subpages/Guia/Guia.html');
    let html = fs.readFileSync(rutaHTML, 'utf8');

    html = html.replace(
        '<script src="Guia.js">',
        nuevaSeccion + '\n    <script src="Guia.js">'
    );

    fs.writeFileSync(rutaHTML, html);
    res.json({ ok: true });
};

module.exports = { agregarSeccion };