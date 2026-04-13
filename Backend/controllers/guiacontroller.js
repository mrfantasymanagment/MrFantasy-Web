const db = require('../config/database');

const obtenerPlugins = async (req, res) => {
    const [plugins] = await db.query('SELECT * FROM Plugins ORDER BY Nombre ASC'); //SELECT * FROM Plugins WHERE Checkout = 1 ORDER BY Nombre ASC
    res.json(plugins);
};


const buscarPlugins = async (req, res) => {
    const { q } = req.query;
    const [plugins] = await db.query(
        'SELECT * FROM Plugins AND Nombre LIKE ? ORDER BY Nombre ASC',
        [`%${q}%`]
    );
    res.json(plugins);
};

//Obtener Plugin Para Editar
const obtenerPluginPorNombre = async (req, res) => {
    const { nombre } = req.params;
    const [plugin] = await db.query('SELECT * FROM Plugins WHERE Nombre = ?', [nombre]);
    res.json(plugin[0]);
};

//Creacion de Archivos .html, .css y .js

const crearArchivosPlugin = async (req, res) => {
    const { nombre, imagen } = req.body;
    const TOKEN = process.env.GITHUB_TOKEN;
    const REPO = 'mrfantasymanagment/MrFantasy-Web';
    const BASE = `Subpages/Guia/Plugins/${nombre}`;
    const extensiones = ['html', 'css', 'js'];

    const contenidos = {
        html: `<!DOCTYPE html>

<html>

<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0">

    <title>En Proceso</title>
    <link rel="stylesheet" href="${nombre}.css" />
    <style>
    </style>

</head>


<body>
    
    <div class="EnProceso_Texto">  
        <div class="hproyectos_Menus">Proximamente</div>
    </div>

    <script src="${nombre}.js"> <\/script>

</body>
</html>
`,

        css: `
        *{
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    height: 100%;
}

body{
    background: rgb(12, 11, 11);
    background-size: cover; 
    background-position: center center;
    background-repeat: no-repeat;        
    font-family: Arial, Helvetica, sans-serif;
    height: 100%;
    display: grid;
    grid-template-columns: 15% 35% 35% 15%;
    grid-template-rows: 25% 50% 25%;
    align-items: center;
    justify-items: center;
}

.EnProceso_Texto {
    width: 85%;
    height:85%;          /* la mitad del width */
    background: rgba(40, 10, 10, 0.821);
    color: rgb(225, 205, 205);
    border-radius: 20px;  /* solo redondea la parte de abajo */
    grid-column: 2/4;
    grid-row: 2;

}

.hproyectos_Menus{
    font-size: 3.1vw;
    display: flex;        
    align-items: center;
    justify-content: center;
}

@keyframes ZoomPulsante{
    0%{
        transform: scale(1);
    }
    50%{
        transform: scale(1.021);
    }
    100%{
        transform: scale(1);
    }
}
        `,
        js: `
        
// Seleccionamos todas las imágenes dentro de la clase "imagenes"
const imagenes = document.querySelectorAll('img');

// Función para pausar todas las animaciones
function pausarAnimaciones() {
  imagenes.forEach(imagen => {
    imagen.style.animationPlayState = 'paused'; // Pausamos la animación
  });
}

// Función para reanudar todas las animaciones
function reanudarAnimaciones() {
  imagenes.forEach(imagen => {
    imagen.style.animationPlayState = 'running'; // Reanudamos la animación
  });
}

// Cuando el ratón pasa sobre cualquier imagen, pausamos todas las animaciones
imagenes.forEach(imagen => {
  imagen.addEventListener('mouseenter', pausarAnimaciones);
  imagen.addEventListener('mouseleave', reanudarAnimaciones);
});
        `
    };

    for (const ext of extensiones) {
        await fetch(`https://api.github.com/repos/${REPO}/contents/${BASE}/${nombre}.${ext}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `add: archivos ${nombre}`,
                content: Buffer.from(contenidos[ext]).toString('base64')
            })
        });
    }

    // Guardar imagen si existe
    if (imagen) {
        const base64Puro = imagen.split(',')[1];
        const rutaImagen = `${BASE}/${nombre}.png`;
    
        let sha = undefined;
        const getRes = await fetch(`https://api.github.com/repos/${REPO}/contents/${rutaImagen}`, {
            headers: { Authorization: `Bearer ${TOKEN}` }
        });
        if (getRes.ok) {
            const getData = await getRes.json();
            sha = getData.sha;
        }
    
        await fetch(`https://api.github.com/repos/${REPO}/contents/${rutaImagen}`, {
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${TOKEN}`,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: `update: imagen ${nombre}`,
                content: base64Puro,
                ...(sha && { sha })
            })
        });
    }

    res.json({ ok: true });
};

const agregarPlugin = async (req, res) => {
    const { nombre, descripcion, comando1, comando2, comando3, comando4, comando5, comando6, comando7, comando8, enlace, seccion, tags } = req.body;
    
    const enlaceGenerado = `https://mrfantasymanagment.github.io/MrFantasy-Web/Subpages/Guia/Plugins/${nombre}/${nombre}.html`;
    const imagenUrl = `https://raw.githubusercontent.com/mrfantasymanagment/MrFantasy-Web/main/Subpages/Guia/Plugins/${nombre}/${nombre}.png`;

    await db.query(
        'INSERT INTO Plugins (Nombre, Descripcion, Comando1, Comando2, Comando3, Comando4, Comando5, Comando6, Comando7, Comando8, Imagen, Enlace, Url, Seccion, Tags) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [nombre, descripcion, comando1, comando2, comando3, comando4, comando5, comando6, comando7, comando8, imagenUrl, enlaceGenerado, enlace, seccion ?? '', tags ?? '']
    );

    res.json({ ok: true });
};

const modificarPlugin = async (req, res) => {
    const { nombre, descripcion, comando1, comando2, comando3, comando4, comando5, comando6, comando7, comando8, enlace, seccion, tags } = req.body;

    await db.query(
        'UPDATE Plugins SET Descripcion=?, Comando1=?, Comando2=?, Comando3=?, Comando4=?, Comando5=?, Comando6=?, Comando7=?, Comando8=?, Url=?, Seccion=?, Tags=? WHERE Nombre=?',
        [descripcion, comando1, comando2, comando3, comando4, comando5, comando6, comando7, comando8, enlace, seccion ?? '', tags ?? '', nombre]
    );

    res.json({ ok: true });
};

const toggleCheckout = async (req, res) => {
    const { nombre, checkout } = req.body;
    await db.query('UPDATE Plugins SET Checkout=? WHERE Nombre=?', [checkout, nombre]);
    res.json({ ok: true });
};

module.exports = { obtenerPlugins, crearArchivosPlugin, agregarPlugin, obtenerPluginPorNombre, modificarPlugin, buscarPlugins, toggleCheckout};