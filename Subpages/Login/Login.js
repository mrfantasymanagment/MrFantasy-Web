const BACKEND = 'https://mrfantasy-backend.onrender.com';

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
                return fetch(`${BACKEND}/api/auth/google`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        nombre: user.name,
                        proveedor_id: user.sub
                    })
                });
            })
            .then(r => r.json())
            .then(session => {
                localStorage.setItem('usuario', JSON.stringify(session));
                window.location.href = '/';
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

// Leer código de Discord al volver del redirect
const urlParams = new URLSearchParams(window.location.search);
const code = urlParams.get('code');

if (code) {
    fetch(`${BACKEND}/api/auth/discord`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code })
    })
    .then(r => r.json())
    .then(session => {
        localStorage.setItem('usuario', JSON.stringify(session));
        window.location.href = '/';
    });
}