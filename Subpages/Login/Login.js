

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
  const clientId = '1512083761695821946';
  const redirectUri = encodeURIComponent('https://mrfantasymanagment.github.io/MrFantasy-Web/Subpages/Login/Login.html');
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