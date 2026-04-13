let todosLosPlugins = [];

function crearPlugin(datos) {
    const comandos = [datos.Comando1, datos.Comando2, datos.Comando3, datos.Comando4,
                      datos.Comando5, datos.Comando6, datos.Comando7, datos.Comando8]
                      .filter(c => c);

    const checkoutColor = datos.Checkout === 1 ? 'rgb(0, 180, 0)' : 'rgb(180, 0, 0)';

    return `
    <a href="${datos.Enlace}" style="text-decoration: none;">
        <div class="Plugin_Container">
            <div class="Nombre_Campo">
                <div class="hproyectos">${datos.Nombre}</div>
            </div>
            <div class="Descripcion_Campo">
                <div class="hproyectos2" style="white-space: pre-wrap; word-break: break-word;">${datos.Descripcion.replace(/\n/g, '<br>')}</div>
            </div>
            <div class="Comandos_Campo">
                ${comandos.length > 0
                    ? comandos.map((c, i) => `<div class="Comando_Campo_${i + 1}">${c}</div>`).join('')
                    : `<div class="Comando_Campo0">Sin Comandos</div>`
                }
            </div>
            <div class="Imagen_Campo">
                <img src="${datos.Imagen}" class="Plugin_Imagen">
            </div>
            <button class="Editar_Plugin_Boton" onclick="event.preventDefault(); editarPlugin('${datos.Nombre}')">Edit</button>
            <button class="Checkout_Plugin_Boton" style="background:${checkoutColor}; border: 3px solid ${checkoutColor}; filter: brightness(1.4); color: white;" onclick="event.preventDefault(); toggleCheckout('${datos.Nombre}', ${datos.Checkout}, this)">✔</button>
        </div>
    </a>`;
}

function filtrarYRenderizar() {
    const query = document.getElementById('PanelBusqueda_Buscador').value.trim().toLowerCase();
    const seccionSeleccionada = document.querySelector('.PanelBusqueda_Secciones .Seccion_Boton.seleccionado');
    const tagsSeleccionados = [...document.querySelectorAll('.PanelBusqueda_Tags .Seccion_Boton.seleccionado')]
                                .map(t => t.textContent.trim().toLowerCase());

    let resultado = todosLosPlugins;

    if (query !== '') {
        resultado = resultado.filter(p => p.Nombre.toLowerCase().includes(query));
    }

    if (seccionSeleccionada) {
        const seccion = seccionSeleccionada.textContent.trim().toLowerCase();
        resultado = resultado.filter(p => (p.Seccion ?? '').toLowerCase() === seccion);
    }

    if (tagsSeleccionados.length > 0) {
        resultado = resultado.filter(p => {
            const tagsPlugin = (p.Tags ?? '').toLowerCase().split('||');
            return tagsSeleccionados.some(tag => tagsPlugin.includes(tag));
        });
    }

    renderPlugins(resultado);
}

document.querySelectorAll('.PanelBusqueda_Secciones .Seccion_Boton').forEach(boton => {
    boton.addEventListener('click', function() {
        const yaSeleccionado = this.classList.contains('seleccionado');
        document.querySelectorAll('.PanelBusqueda_Secciones .Seccion_Boton').forEach(b => b.classList.remove('seleccionado'));
        if (!yaSeleccionado) this.classList.add('seleccionado');
        filtrarYRenderizar();
    });
});

document.querySelectorAll('.PanelBusqueda_Tags .Seccion_Boton').forEach(boton => {
    boton.addEventListener('click', function() {
        this.classList.toggle('seleccionado');
        filtrarYRenderizar();
    });
});

function renderPlugins(plugins) {
    const contenedor = document.getElementById('contenedor-plugins');
    const letras = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
    contenedor.innerHTML = '';
    letras.forEach(letra => {
        const pluginsDeLetra = plugins.filter(p => p.Nombre[0].toUpperCase() === letra);
        if (pluginsDeLetra.length === 0) return;
        contenedor.insertAdjacentHTML('beforeend', `<div class="Letras_Estilo">${letra}</div>`);
        pluginsDeLetra.forEach(plugin => {
            contenedor.insertAdjacentHTML('beforeend', crearPlugin(plugin));
        });
    });
}

function editarPlugin(nombre) {
    window.location.href = `https://mrfantasymanagment.github.io/MrFantasy-Web/Subpages/Staff/Editar/Guia_Edit.html?nombre=${nombre}`;
}

fetch('https://mrfantasy-backend.onrender.com/guia/plugins')
    .then(r => r.json())
    .then(plugins => {
        todosLosPlugins = plugins;
        renderPlugins(plugins);
    });

document.querySelector('.PanelBusqueda_Lupa').addEventListener('click', function(e) {
    e.preventDefault();
    filtrarYRenderizar();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

window.addEventListener('load', function() {
    if (new URLSearchParams(window.location.search).get('exito') === '1') {
        document.getElementById('Reportes_Agradecimiento').style.display = 'flex';
        history.replaceState(null, '', window.location.pathname);
    }
});

document.getElementById('Reportes_Cerrar').addEventListener('click', function() {
    document.getElementById('Reportes_Agradecimiento').style.display = 'none';
});