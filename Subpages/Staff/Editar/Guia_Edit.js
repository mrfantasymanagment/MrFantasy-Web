let imagenBase64 = '';

const nombreParam = new URLSearchParams(window.location.search).get('nombre');

// ── Autocompletar campos ──────────────────────────────────────────
if (nombreParam) {
    fetch(`https://mrfantasy-backend.onrender.com/guia/plugin/${nombreParam}`)
        .then(r => r.json())
        .then(data => {
            document.getElementById('Nombre').value = data.Nombre || '';
            document.getElementById('Descripcion').value = data.Descripcion || '';
            document.getElementById('Comando_1').value = data.Comando1 || '';
            document.getElementById('Comando_2').value = data.Comando2 || '';
            document.getElementById('Comando_3').value = data.Comando3 || '';
            document.getElementById('Comando_4').value = data.Comando4 || '';
            document.getElementById('Comando_5').value = data.Comando5 || '';
            document.getElementById('Comando_6').value = data.Comando6 || '';
            document.getElementById('Comando_7').value = data.Comando7 || '';
            document.getElementById('Comando_8').value = data.Comando8 || '';
            document.getElementById('PluginLink').value = data.Url || '';

            if (data.Imagen) {
                const campo = document.getElementById('Imagen_Campo');
                campo.style.backgroundImage = `url(${data.Imagen})`;
                campo.style.backgroundSize = 'cover';
                campo.style.backgroundPosition = 'center';
                document.querySelector('#Imagen_Campo .AñadirImagen_Campo').style.display = 'none';
            }

            // Autocompletar sección
            if (data.Seccion) {
                document.querySelectorAll('.PanelBusqueda_Secciones_Ref .Seccion_Boton').forEach(b => {
                    if (b.textContent.trim() === data.Seccion) b.classList.add('seleccionado');
                });
            }

            // Autocompletar tags
            if (data.Tags) {
                const tags = data.Tags.split('||');
                document.querySelectorAll('.PanelBusqueda_Tags_Ref .Seccion_Boton').forEach(b => {
                    if (tags.includes(b.textContent.trim())) b.classList.add('seleccionado');
                });
            }
        });
}

// ── Limitar inputs por espacio ────────────────────────────────────
function limitarPorEspacio(input) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const estilo = window.getComputedStyle(input);
    ctx.font = `${estilo.fontSize} ${estilo.fontFamily}`;
    const anchoTexto = ctx.measureText(input.value).width;
    const anchoDisponible = input.clientWidth - (parseFloat(estilo.paddingLeft) + parseFloat(estilo.paddingRight));
    if (anchoTexto > anchoDisponible) input.value = input.value.slice(0, -1);
}

document.getElementById('Nombre').addEventListener('input', function() { limitarPorEspacio(this); });
document.getElementById('Comando_1').addEventListener('input', function() { limitarPorEspacio(this); });
document.getElementById('Comando_2').addEventListener('input', function() { limitarPorEspacio(this); });
document.getElementById('Comando_3').addEventListener('input', function() { limitarPorEspacio(this); });
document.getElementById('Comando_4').addEventListener('input', function() { limitarPorEspacio(this); });
document.getElementById('Comando_5').addEventListener('input', function() { limitarPorEspacio(this); });
document.getElementById('Comando_6').addEventListener('input', function() { limitarPorEspacio(this); });
document.getElementById('Comando_7').addEventListener('input', function() { limitarPorEspacio(this); });
document.getElementById('Comando_8').addEventListener('input', function() { limitarPorEspacio(this); });
document.getElementById('PluginLink').addEventListener('input', function() { limitarPorEspacio(this); });

document.querySelectorAll('.PanelBusqueda_Secciones_Ref .Seccion_Boton').forEach(boton => {
    boton.addEventListener('click', function() {
        document.querySelectorAll('.PanelBusqueda_Secciones_Ref .Seccion_Boton').forEach(b => b.classList.remove('seleccionado'));
        this.classList.add('seleccionado');
    });
});

document.querySelectorAll('.PanelBusqueda_Tags_Ref .Seccion_Boton').forEach(boton => {
    boton.addEventListener('click', function() {
        this.classList.toggle('seleccionado');
    });
});

// ── Enviar edición ────────────────────────────────────────────────
document.getElementById('Añadir_Campo').addEventListener('click', async function() {
    const nombre = document.getElementById('Nombre').value;
    const descripcion = document.getElementById('Descripcion').value;
    const enlace = document.getElementById('PluginLink').value;
    const seccionSeleccionada = document.querySelector('.PanelBusqueda_Secciones_Ref .Seccion_Boton.seleccionado');
    const haySeccion = seccionSeleccionada !== null;

    if (nombre.trim() === '' || descripcion.trim() === '' || enlace.trim() === '' || !haySeccion) {
        document.getElementById('Reportes_Incompleto').style.display = 'flex';
        return;
    }

    const seccion = seccionSeleccionada.textContent.trim();
    const tags = [...document.querySelectorAll('.PanelBusqueda_Tags_Ref .Seccion_Boton.seleccionado')]
                    .map(t => t.textContent.trim())
                    .join('||');

    try {
        const response = await fetch('https://mrfantasy-backend.onrender.com/guia/modificar', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                descripcion,
                comando1: document.getElementById('Comando_1').value,
                comando2: document.getElementById('Comando_2').value,
                comando3: document.getElementById('Comando_3').value,
                comando4: document.getElementById('Comando_4').value,
                comando5: document.getElementById('Comando_5').value,
                comando6: document.getElementById('Comando_6').value,
                comando7: document.getElementById('Comando_7').value,
                comando8: document.getElementById('Comando_8').value,
                enlace,
                seccion,
                tags
            })
        });

        if (response.ok) {
            window.location.href = `https://mrfantasymanagment.github.io/MrFantasy-Web/Subpages/Guia/Guia.html?exito=1`;
        }
        } else {
            document.getElementById('Reportes_Incompleto').style.display = 'flex';
        }
    } catch (error) {
        console.log(error);
        document.getElementById('Reportes_Incompleto').style.display = 'flex';
    }
});

document.getElementById('Reportes_Cerrar').addEventListener('click', function() {
    document.getElementById('Reportes_Agradecimiento').style.display = 'none';
});

document.getElementById('Reportes_Error_Cerrar').addEventListener('click', function() {
    document.getElementById('Reportes_Incompleto').style.display = 'none';
});

document.getElementById('Imagen_Input').addEventListener('change', function(e) {
    const archivo = e.target.files[0];
    if (archivo) {
        const reader = new FileReader();
        reader.onload = function(e) {
            const img = new Image();
            img.onload = function() {
                const canvas = document.createElement('canvas');
                canvas.width = 48;
                canvas.height = 48;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0, 48, 48);
                imagenBase64 = canvas.toDataURL('image/png');
                const campo = document.getElementById('Imagen_Campo');
                campo.style.backgroundImage = `url(${imagenBase64})`;
                campo.style.backgroundSize = 'cover';
                campo.style.backgroundPosition = 'center';
                document.querySelector('#Imagen_Campo .AñadirImagen_Campo').style.display = 'none';
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(archivo);
    }
});

// ── Textarea Descripcion ──────────────────────────────────────────
function getCtxDesc(textarea) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const estilo = window.getComputedStyle(textarea);
    ctx.font = `${estilo.fontSize} ${estilo.fontFamily}`;
    return ctx;
}

function getAnchoDisponibleDesc(textarea) {
    const estilo = window.getComputedStyle(textarea);
    const ancho = textarea.clientWidth - (parseFloat(estilo.paddingLeft) + parseFloat(estilo.paddingRight));
    return ancho * 0.93;
}

function contarLineasVisualesDesc(textarea) {
    const ctx = getCtxDesc(textarea);
    const anchoDisponible = getAnchoDisponibleDesc(textarea);
    const lineas = textarea.value.split('\n');
    let totalVisuales = 0;
    for (const linea of lineas) {
        if (linea === '') { totalVisuales += 1; continue; }
        const anchoLinea = ctx.measureText(linea).width;
        totalVisuales += Math.ceil(anchoLinea / anchoDisponible);
    }
    return totalVisuales;
}

const descripcion = document.getElementById('Descripcion');

descripcion.addEventListener('keydown', function(e) {
    if (e.key === 'Enter') {
        if (contarLineasVisualesDesc(this) >= 6) e.preventDefault();
        return;
    }
});

descripcion.addEventListener('input', function() {
    const debeRevertir =
        contarLineasVisualesDesc(this) > 6 ||
        this.value.split('\n').length > 6;
    if (debeRevertir) {
        this.value = this.dataset.lastValue ?? '';
    } else {
        this.dataset.lastValue = this.value;
    }
});