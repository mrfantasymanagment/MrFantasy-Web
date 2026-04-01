

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

document.querySelector('.Texto_Ninckname').addEventListener('input', function() {
  limitarPorEspacio(this);
});

document.querySelector('.Texto_Contraseña').addEventListener('input', function() {
  limitarPorEspacio(this);
});

//Recuperacion Datos Reportes
document.getElementById('Reportes_Enviar').addEventListener('click', function() {
    const nickname = document.getElementById('Nickname').value;
    const contraseña = document.getElementById('Contraseña').value;



    if (titulo.trim() === '' || cuerpo.trim() === '') {
      document.getElementById('Reportes_Incompleto').style.display = 'flex';
      return;
  }

    console.log({ nombre, titulo, cuerpo }); // ← faltaba esto
    // Muestra la pantalla flotante
    document.getElementById('Reportes_Agradecimiento').style.display = 'flex';

    // Borra el contenido
    document.getElementById('Nombre').value = '';
    document.getElementById('Titulo').value = '';
    document.getElementById('Cuerpo').value = '';
    document.querySelector('.Texto_Cuerpo').dataset.lastValue = '';
});

document.getElementById('Reportes_Cerrar').addEventListener('click', function() {
    document.getElementById('Reportes_Agradecimiento').style.display = 'none';
});

document.getElementById('Reportes_Error_Cerrar').addEventListener('click', function() {
  document.getElementById('Reportes_Incompleto').style.display = 'none';
});

function formatearDHM(seg) {
  const d = Math.floor(seg / 86400);
  const h = Math.floor((seg % 86400) / 3600).toString().padStart(2, '0');
  const m = Math.floor((seg % 3600) / 60).toString().padStart(2, '0');
  const s = (seg % 60).toString().padStart(2, '0');
  return `${d}d ${h}h ${m}m ${s}s`;
}

function calcularRestantes(fechaFin) {
  return Math.max(0, Math.floor((new Date(fechaFin) - new Date()) / 1000));
}

fetch('Timer.json')
  .then(r => r.json())
  .then(config => {

    // ─── Evento ──────────────────────────────────────
    setInterval(() => {
      document.getElementById('Evento_Display').textContent =
        formatearDHM(calcularRestantes(config.evento_fin));
    }, 1000);

    // ─── Update ──────────────────────────────────────
    setInterval(() => {
      document.getElementById('Update_Display').textContent =
        formatearDHM(calcularRestantes(config.update_fin));
    }, 1000);

  })
  .catch(err => console.error('Error cargando config.json:', err));


// Seleccionamos todas las imágenes dentro de la clase "imagenes"
const imagenes = document.querySelectorAll('img');

// Función para pausar todas las animaciones
function pausarAnimaciones() {
  imagenes.forEach(imagen => {
    imagen.style.animationPlayState = 'paused'; // Pausamos la animación
  });
}

// Función para reanudar todas las animaciones
function reanudarAnimaciones() {
  imagenes.forEach(imagen => {
    imagen.style.animationPlayState = 'running'; // Reanudamos la animación
  });
}

// Cuando el ratón pasa sobre cualquier imagen, pausamos todas las animaciones
imagenes.forEach(imagen => {
  imagen.addEventListener('mouseenter', pausarAnimaciones);
  imagen.addEventListener('mouseleave', reanudarAnimaciones);
});

/*
const btnMenu = document.querySelector('.Menu-Boton');
const menuLateral = document.querySelector('.Menu-Lateral');

btnMenu.addEventListener('click', () => {
    menuLateral.classList.toggle('abierto');
}); */