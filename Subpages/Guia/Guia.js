function crearPlugin(datos) {
    return `
    <a href="${datos.Enlace}" style="text-decoration: none;">
    <div class="Plugin_Container">
        <div class="Nombre_Campo">
            <div class="hproyectos">${datos.Nombre}</div>
        </div>
        <div class="Descripcion_Campo">
            <div class="hproyectos2">${datos.Descripcion}</div>
        </div>
        <div class="Comandos_Campo">
            <div class="hproyectos2">${datos.Comando1}</div>
        </div>
        <div class="Imagen_Campo">
            <img src="${datos.Imagen}" class="Plugin_Imagen">
        </div>
        <button class="Editar_Plugin_Boton" onclick="event.preventDefault(); editarPlugin('${datos.Nombre}')">E</button>
    </div>
    </a>`;
}

function editarPlugin(nombre) {
    window.location.href = `https://mrfantasymanagment.github.io/MrFantasy-Web/Subpages/Staff/Editar/Guia_Edit.html?nombre=${nombre}`;
}

fetch('https://mrfantasy-backend.onrender.com/guia/plugins')
    .then(r => r.json())
    .then(plugins => {
        const contenedor = document.getElementById('contenedor-plugins');
        plugins.forEach(plugin => {
            contenedor.insertAdjacentHTML('beforeend', crearPlugin(plugin));
        });
    });

    window.addEventListener('load', function() {
        if (new URLSearchParams(window.location.search).get('exito') === '1') {
            document.getElementById('Reportes_Agradecimiento').style.display = 'flex';
        }
    });