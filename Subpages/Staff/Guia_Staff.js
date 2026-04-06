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
  document.getElementById('Login_Campo').addEventListener('click', async function() {
    const nickname = document.getElementById('Nickname').value;
    const contrasena = document.getElementById('Contraseña').value;
  
    if (nickname.trim() === '' || contrasena.trim() === '') {
        document.getElementById('Reportes_Incompleto').style.display = 'flex';
        return;
    }
  
    try {
        const response = await fetch('https://mrfantasy-backend.onrender.com/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ nickname, contrasena })
        });
  
        const data = await response.json();
  
        if (response.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('nickname', data.nickname);
            document.getElementById('Reportes_Agradecimiento').style.display = 'flex';
            document.getElementById('Nickname').value = '';
            document.getElementById('Contraseña').value = '';
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
  
