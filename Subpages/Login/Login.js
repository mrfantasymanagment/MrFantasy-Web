

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

  document.getElementById('Google_Campo').addEventListener('click', function() {
    const client = google.accounts.oauth2.initTokenClient({
        client_id: '225885462765-n32kdp8pcp5suonhucgr3lem5veb62jt.apps.googleusercontent.com',
        scope: 'openid email profile',
        callback: (response) => {
            fetch('https://www.googleapis.com/oauth2/v3/userinfo', {
                headers: { Authorization: `Bearer ${response.access_token}` }
            })
            .then(r => r.json())
            .then(user => {
                console.log('Email:', user.email);
                console.log('Nombre:', user.name);
            });
        }
    });
    client.requestAccessToken();
});

  // Login Con Discord
document.getElementById('Discord_Campo').addEventListener('click', function() {
  const clientId = '1488985476793630810';
  const redirectUri = encodeURIComponent('http://127.0.0.1:5500/Subpages/Login/Login.html');
  const scope = 'identify email';
  
  window.location.href = `https://discord.com/oauth2/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=${scope}`;
});

//Leer Datos Discord
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
    console.log('Login con Discord exitoso, código:', code);
    // Acá más adelante manejás el código para obtener los datos del usuario
}