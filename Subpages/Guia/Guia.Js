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
    </div>
    </a>`;


fetch('https://mrfantasy-backend.onrender.com/guia/plugins')
    .then(r => r.json())
    .then(plugins => {
        const contenedor = document.getElementById('contenedor-plugins');
        plugins.forEach(plugin => {
            contenedor.insertAdjacentHTML('beforeend', crearPlugin(plugin));
        });
    });