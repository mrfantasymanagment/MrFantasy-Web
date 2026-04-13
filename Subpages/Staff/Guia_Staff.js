let imagenBase64 = '';

// ── Bloqueo por espacio en inputs de una línea ──
function limitarPorEspacio(input) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const estilo = window.getComputedStyle(input);
    ctx.font = `${estilo.fontSize} ${estilo.fontFamily}`;
a
    const anchoTexto = ctx.measureText(input.value).width;
    const anchoDisponible = input.clientWidth - (parseFloat(estilo.paddingLeft) + parseFloat(estilo.paddingRight));

    if (anchoTexto > anchoDisponible) {
        input.value = input.value.slice(0, -1);
    }
}

// Aplicar limitarPorEspacio a todos los inputs de una línea
const inputsUnaLinea = [
    'Nombre',
    'Comando_1', 'Comando_2', 'Comando_3', 'Comando_4',
    'Comando_5', 'Comando_6', 'Comando_7', 'Comando_8',
    'PluginLink'
];

inputsUnaLinea.forEach(id => {
    const el = document.getElementById(id);
    if (el) {
        el.addEventListener('input', function() {
            limitarPorEspacio(this);
        });
    }
});

// ── Botón Añadir ──
document.getElementById('Añadir_Campo').addEventListener('click', async function() {
    const nombre      = document.getElementById('Nombre').value.trim();
    const descripcion = document.getElementById('Descripcion').value.trim();
    const enlace      = document.getElementById('PluginLink').value.trim();

    if (nombre === '' || descripcion === '' || enlace === '' || imagenBase64 === '') {
        document.getElementById('Reportes_Incompleto').style.display = 'flex';
        return;
    }

    try {
        await fetch('https://mrfantasy-backend.onrender.com/guia/crear-archivos', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre,
                imagen: imagenBase64
            })
        });

        const response = await fetch('https://mrfantasy-backend.onrender.com/guia/agregar', {
            method: 'POST',
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
                enlace
            })
        });

        if (response.ok) {
            window.location.href = 'https://mrfantasymanagment.github.io/MrFantasy-Web/Subpages/Guia/Guia.html?exito=1';
        } else {
            document.getElementById('Reportes_Incompleto').style.display = 'flex';
        }
    } catch (error) {
        console.log(error);
        document.getElementById('Reportes_Incompleto').style.display = 'flex';
    }
});

// ── Cerrar modal error ──
document.getElementById('Reportes_Error_Cerrar').addEventListener('click', function() {
    document.getElementById('Reportes_Incompleto').style.display = 'none';
});

// ── Carga y redimensión de imagen ──
document.getElementById('Imagen_Input').addEventListener('change', function(e) {
    const archivo = e.target.files[0];
    if (!archivo) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const img = new Image();
        img.onload = function() {
            const canvas = document.createElement('canvas');
            canvas.width  = 48;
            canvas.height = 48;
            const ctx = canvas.getContext('2d');
            ctx.drawImage(img, 0, 0, 48, 48);
            imagenBase64 = canvas.toDataURL('image/png');

            const campo = document.getElementById('Imagen_Campo');
            campo.style.backgroundImage    = `url(${imagenBase64})`;
            campo.style.backgroundSize     = 'cover';
            campo.style.backgroundPosition = 'center';

            // Ocultar el texto "Añadir Imagen" una vez cargada
            const texto = campo.querySelector('.Fuente_Añadir');
            if (texto) texto.style.display = 'none';
        };
        img.src = e.target.result;
    };
    reader.readAsDataURL(archivo);
});
