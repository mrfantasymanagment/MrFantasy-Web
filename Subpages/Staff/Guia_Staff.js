//Campos Texto
document.getElementById('Añadir_Campo').addEventListener('click', async function() {
  const nombre = document.getElementById('Nombre').value;
  const descripcion = document.getElementById('Descripcion').value;
  const enlace = document.getElementById('PluginLink').value;
  const seccionSeleccionada = document.querySelector('.PanelBusqueda_Secciones_Ref .Seccion_Boton.seleccionado');
  const haySeccion = seccionSeleccionada !== null;

  if (nombre.trim() === '' || descripcion.trim() === '' || enlace.trim() === '' || imagenBase64 === '' || !haySeccion) {
    document.getElementById('Reportes_Incompleto').style.display = 'flex';
    return;
  }

  const seccion = seccionSeleccionada.textContent.trim();
  const tags = [...document.querySelectorAll('.PanelBusqueda_Tags_Ref .Seccion_Boton.seleccionado')]
                .map(t => t.textContent.trim())
                .join('||');

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
              descripcion: document.getElementById('Descripcion').value,
              comando1: document.getElementById('Comando_1').value,
              comando2: document.getElementById('Comando_2').value,
              comando3: document.getElementById('Comando_3').value,
              comando4: document.getElementById('Comando_4').value,
              comando5: document.getElementById('Comando_5').value,
              comando6: document.getElementById('Comando_6').value,
              comando7: document.getElementById('Comando_7').value,
              comando8: document.getElementById('Comando_8').value,
              enlace: document.getElementById('PluginLink').value,
              seccion,
              tags
          })
      });

      const data = await response.json();

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

      const data = await response.json();

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
      if (linea === '') {
        totalVisuales += 1;
        continue;
      }
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