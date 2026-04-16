

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

document.querySelector('.Texto_Titulo').addEventListener('input', function() {
  limitarPorEspacio(this);
});

// ── Textarea Cuerpo ──────────────────────────────────────────

function getCtx(textarea) {
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');
  const estilo = window.getComputedStyle(textarea);
  ctx.font = `${estilo.fontSize} ${estilo.fontFamily}`;
  return ctx;
}

function getAnchoDisponible(textarea) {
  const estilo = window.getComputedStyle(textarea);
  const ancho = textarea.clientWidth - (parseFloat(estilo.paddingLeft) + parseFloat(estilo.paddingRight));
  return ancho * 0.98; // 90% del ancho real — ajustá este valor a gusto
}

function contarLineasVisuales(textarea) {
  const ctx = getCtx(textarea);
  const anchoDisponible = getAnchoDisponible(textarea);
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

const cuerpo = document.querySelector('.Texto_Cuerpo');

cuerpo.addEventListener('keydown', function(e) {
  // Solo bloqueamos Enter si ya hay 5 líneas visuales
  if (e.key === 'Enter') {
    if (contarLineasVisuales(this) >= 5) e.preventDefault();
    return;
  }
});

cuerpo.addEventListener('input', function() {
  const debeRevertir =
    contarLineasVisuales(this) > 5 ||
    this.value.split('\n').length > 5;

  if (debeRevertir) {
    this.value = this.dataset.lastValue ?? '';
  } else {
    this.dataset.lastValue = this.value;
  }
});

//Recuperacion Datos Reportes
document.getElementById('Reportes_Enviar').addEventListener('click', function() {
    const nombre = document.getElementById('Nombre').value;
    const titulo = document.getElementById('Titulo').value;
    const cuerpo = document.getElementById('Cuerpo').value;


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

// Funcion en Vivo
// ── En Vivo ──────────────────────────────────────────────────

async function verificarDirecto() {
  try {
      const res = await fetch('/api/directo');
      const data = await res.json();

      const contenedor = document.getElementById('Directo');
      const frame = document.getElementById('Directo_Frame');

      if (data.en_vivo) {
          frame.src = `https://www.youtube.com/embed/${data.video_id}?autoplay=1`;
          contenedor.style.display = 'block';
      } else {
          contenedor.style.display = 'none';
          frame.src = '';
      }
  } catch (e) {
      console.error('Error verificando directo:', e);
  }
}

verificarDirecto();
setInterval(verificarDirecto, 15 * 60 * 1000); // cada 15 minutos