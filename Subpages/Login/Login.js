

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

document.querySelector('.Texto_Nickname').addEventListener('input', function() {
  limitarPorEspacio(this);
});

document.querySelector('.Texto_Contraseña').addEventListener('input', function() {
  limitarPorEspacio(this);
});

//Recuperacion Datos Reportes
document.getElementById('Login_Campo').addEventListener('click', function() {
    const nickname = document.getElementById('Nickname').value;
    const contraseña = document.getElementById('Contraseña').value;



    if (nickname.trim() === '' || contraseña.trim() === '') {
      document.getElementById('Reportes_Incompleto').style.display = 'flex';
      return;
  }

    console.log({nickname, contraseña}); 
    // Muestra la pantalla flotante
    document.getElementById('Reportes_Agradecimiento').style.display = 'flex';

    // Borra el contenido
    document.getElementById('Nickname').value = '';
    document.getElementById('Contraseña').value = '';
});

document.getElementById('Reportes_Cerrar').addEventListener('click', function() {
    document.getElementById('Reportes_Agradecimiento').style.display = 'none';
});

document.getElementById('Reportes_Error_Cerrar').addEventListener('click', function() {
  document.getElementById('Reportes_Incompleto').style.display = 'none';
});

  // Login Con Google

  
