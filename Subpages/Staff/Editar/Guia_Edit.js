let imagenBase64 = '';

const nombre = new URLSearchParams(window.location.search).get('nombre');

// Precargar datos
if (nombre) {
    fetch(`https://mrfantasy-backend.onrender.com/guia/plugin/${nombre}`)
        .then(r => r.json())
        .then(data => {
            document.getElementById('Nombre').value = data.Nombre;
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
            }
        });
}

document.getElementById('Añadir_Campo').addEventListener('click', async function() {
    try {
        const response = await fetch('https://mrfantasy-backend.onrender.com/guia/modificar', {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                nombre: document.getElementById('Nombre').value,
                descripcion: document.getElementById('Descripcion').value,
                comando1: document.getElementById('Comando_1').value,
                comando2: document.getElementById('Comando_2').value,
                comando3: document.getElementById('Comando_3').value,
                comando4: document.getElementById('Comando_4').value,
                comando5: document.getElementById('Comando_5').value,
                comando6: document.getElementById('Comando_6').value,
                comando7: document.getElementById('Comando_7').value,
                comando8: document.getElementById('Comando_8').value,
                enlace: document.getElementById('PluginLink').value
            })
        });

        if (response.ok) {
            document.getElementById('Reportes_Agradecimiento').style.display = 'flex';
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
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(archivo);
    }
});