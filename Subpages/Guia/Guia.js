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
            
            const comandos = [datos.Comando1, datos.Comando2, datos.Comando3, datos.Comando4,
                              datos.Comando5, datos.Comando6, datos.Comando7, datos.Comando8]
                            .filter(c => c);

            // y en el template:
            <div class="Comandos_Campo">
                ${comandos.length > 0
                    ? comandos.map((c, i) => `<div class="Comando_Campo_${i + 1}">${c}</div>`).join('')
                    : `<div class="Comandos_No_Disponibles">Uso interno</div>`
                }
            </div>
    
            <div class="Imagen_Campo">
                <img src="${datos.Imagen}" class="Plugin_Imagen">
            </div>
            <button class="Editar_Plugin_Boton" onclick="event.preventDefault(); editarPlugin('${datos.Nombre}')">Edit</button>
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
        const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        letras.forEach(letra => {
            contenedor.insertAdjacentHTML('beforeend', `<div class="Letras_Estilo">${letra}</div>`);
            
            const pluginsDeLetra = plugins.filter(p => p.Nombre[0].toUpperCase() === letra);
            pluginsDeLetra.forEach(plugin => {
                contenedor.insertAdjacentHTML('beforeend', crearPlugin(plugin));
            });
        });
    });

    window.addEventListener('load', function() {
        if (new URLSearchParams(window.location.search).get('exito') === '1') {
            document.getElementById('Reportes_Agradecimiento').style.display = 'flex';
        }
    });

    document.getElementById('Reportes_Cerrar').addEventListener('click', function() {
        document.getElementById('Reportes_Agradecimiento').style.display = 'none';
    });