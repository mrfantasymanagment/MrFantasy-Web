function crearPlugin(datos) {
    return `
            <a href="https://raw.githubusercontent.com/mrfantasymanagment/MrFantasy-Web/refs/heads/main/Resources/Final/BannerMrFantasy.png" style="text-decoration: none;">
                <div class="Plugin_Container">
                    <div class="Nombre_Campo">
                        <div class="hproyectos">TestCss</div>
                    </div>
                    <div class="Descripcion_Campo">
                        <div class="hproyectos2">DescTestCss</div>
                    </div>
                    <div class="Comandos_Campo">
                        <div class="Comando_Campo_1">Test Comando 1</div>
                        <div class="Comando_Campo_2">Test Comando 2</div>
                        <div class="Comando_Campo_3">Test Comando 3</div>
                        <div class="Comando_Campo_4">Test Comando 4</div>
                        <div class="Comando_Campo_5">Test Comando 5</div>
                        <div class="Comando_Campo_6">Test Comando 6</div>
                        <div class="Comando_Campo_7">Test Comando 7</div>
                        <div class="Comando_Campo_8">Test Comando 8</div>
                    </div>
                    <div class="Imagen_Campo">
                        <img src="https://raw.githubusercontent.com/mrfantasymanagment/MrFantasy-Web/refs/heads/main/Resources/Final/BannerMrFantasy.png" class="Plugin_Imagen">
                    </div>
                    <button class="Editar_Plugin_Boton" onclick="event.preventDefault(); editarPlugin('TestCss')">E</button>
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