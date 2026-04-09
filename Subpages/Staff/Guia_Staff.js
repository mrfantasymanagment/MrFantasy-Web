//Campos Texto
let imagenBase64 = ''; // ← variable global

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
          body: JSON.stringify({ 
              nombre,
              imagen: imagenBase64  // ← agregado
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
          document.getElementById('Reportes_Agradecimiento').style.display = 'flex';
          window.location.href = 'https://mrfantasymanagment.github.io/MrFantasy-Web/Subpages/Guia/Guia.html';
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