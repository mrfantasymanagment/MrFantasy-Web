//Campos Texto
function limitarPorEspacio(input) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const estilo = window.getComputedStyle(input);
  ctx.font = `${estilo.fontSize} ${estilo.fontFamily}`;
  
  const anchoTexto = ctx.measureText(input.value).width;
  const anchoDisponible = input.clientWidth - (parseFloat(estilo.paddingLeft) + parseFloat(estilo.paddingRight));
  
  if (anchoTexto > anchoDisponible) {
      input.value = input.value.slice(0, -1);
  }
}

document.querySelector('.Texto_Nombre').addEventListener('input', function() {
  limitarPorEspacio(this);
});

document.querySelector('.Texto_Descripcion').addEventListener('input', function() {
  limitarPorEspacio(this);
});

document.getElementById('Añadir_Campo').addEventListener('click', async function() {
  const nombre = document.getElementById('Nombre').value;

  if (nombre.trim() === '') {
      document.getElementById('Reportes_Incompleto').style.display = 'flex';
      return;
  }

  try {
      await fetch('https://mrfantasy-backend.onrender.com/guia/crear-archivos', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ nombre })
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
              imagen: document.getElementById('imagen: imagenBase64,').value,
              enlace: document.getElementById('PluginLink').value
          })
      });

      const data = await response.json();

      if (response.ok) {
          document.getElementById('Reportes_Agradecimiento').style.display = 'flex';
          document.getElementById('Nombre').value = '';
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
          const imagen = document.getElementById('Imagen_Campo');
          imagen.style.backgroundImage = `url(${e.target.result})`;
          imagen.style.backgroundSize = 'cover';
          imagen.style.backgroundPosition = 'center';
      };
      reader.readAsDataURL(archivo);
  }
});