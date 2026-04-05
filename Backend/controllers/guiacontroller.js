const agregarSeccion = async (req, res) => {
    const { nombre, descripcion, comandos, imagen, enlace } = req.body;

    const TOKEN = process.env.GITHUB_TOKEN;
    const REPO = 'mrfantasymanagment/MrFantasy-Web';
    const ARCHIVO = 'Final/Subpages/Guia/Guia.html';
    const API = `https://api.github.com/repos/${REPO}/contents/${ARCHIVO}`;

    // 1. Leer el archivo actual
    const response = await fetch(API, {
        headers: { Authorization: `Bearer ${TOKEN}` }
    });
    const data = await response.json();

    // 2. Decodificar, modificar, recodificar
    let html = Buffer.from(data.content, 'base64').toString('utf8');

    const nuevaSeccion = `
    <a href="${enlace}" style="text-decoration: none;">
    <div class="Plugin_Container">
        <div class="Nombre_Campo"><div class="hproyectos">${nombre}</div></div>
        <div class="Descripcion_Campo"><div class="hproyectos2">${descripcion}</div></div>
        <div class="Comandos_Campo"><div class="hproyectos2">${comandos}</div></div>
        <div class="Imagen_Campo"><img src="${imagen}" class="Instagram_Imagen"></div>
    </div>
    </a>`;

    html = html.replace(
        '<script src="Guia.js">',
        nuevaSeccion + '\n    <script src="Guia.js">'
    );

    // 3. Escribir de vuelta a GitHub
    await fetch(API, {
        method: 'PUT',
        headers: {
            Authorization: `Bearer ${TOKEN}`,
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            message: `add: seccion ${nombre}`,
            content: Buffer.from(html).toString('base64'),
            sha: data.sha
        })
    });

    res.json({ ok: true });
};

module.exports = { agregarSeccion }