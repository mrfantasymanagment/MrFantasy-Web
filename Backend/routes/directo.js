const express = require('express');
const router = express.Router();
const pool = require('../config/database');

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

async function obtenerCacheDB() {
    const [rows] = await pool.query(
        `SELECT en_vivo, video_id, actualizado_en 
         FROM directo_cache 
         WHERE id = 1`
    );
    if (rows.length === 0) return null;

    const antiguedad = Date.now() - new Date(rows[0].actualizado_en).getTime();
    if (antiguedad < 5 * 60 * 1000) return rows[0];
    return null;
}

async function guardarCacheDB(enVivo, videoId) {
    await pool.query(
        `INSERT INTO directo_cache (id, en_vivo, video_id, actualizado_en)
         VALUES (1, ?, ?, NOW())
         ON DUPLICATE KEY UPDATE 
            en_vivo = VALUES(en_vivo),
            video_id = VALUES(video_id),
            actualizado_en = VALUES(actualizado_en)`,
        [enVivo, videoId]
    );
}

async function buscarStreamActivo() {
    // search: 100 unidades — solo se llama cuando no hay video_id guardado
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`;
    const ytData = await fetch(url).then(r => r.json());
    console.log('YT SEARCH RAW:', JSON.stringify(ytData, null, 2));

    if (!ytData.items?.length) return null;
    return ytData.items[0].id.videoId;
}

async function verificarStreamActivo(videoId) {
    // videos: 1 unidad — se llama cuando ya tenemos el video_id
    const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${videoId}&key=${API_KEY}`;
    const ytData = await fetch(url).then(r => r.json());
    console.log('YT VIDEOS RAW:', JSON.stringify(ytData, null, 2));

    const item = ytData.items?.[0];
    return item?.snippet?.liveBroadcastContent === 'live';
}

router.get('/', async (req, res) => {
    try {
        const cache = await obtenerCacheDB();
        if (cache) return res.json({ en_vivo: cache.en_vivo, video_id: cache.video_id });

        // Obtenemos el ultimo video_id guardado aunque el cache haya expirado
        const [rows] = await pool.query(`SELECT video_id FROM directo_cache WHERE id = 1`);
        const videoIdGuardado = rows[0]?.video_id;

        let enVivo = false;
        let videoId = null;

        if (videoIdGuardado) {
            // Tenemos un ID guardado: verificamos si sigue en vivo (1 unidad)
            enVivo = await verificarStreamActivo(videoIdGuardado);
            if (enVivo) {
                videoId = videoIdGuardado;
            } else {
                // Ya no está en vivo, buscamos si hay uno nuevo (100 unidades)
                videoId = await buscarStreamActivo();
                enVivo = !!videoId;
            }
        } else {
            // No tenemos ID guardado, buscamos desde cero (100 unidades)
            videoId = await buscarStreamActivo();
            enVivo = !!videoId;
        }

        await guardarCacheDB(enVivo ? 1 : 0, videoId);
        res.json({ en_vivo: enVivo ? 1 : 0, video_id: videoId });

    } catch (e) {
        console.error('Error en /api/directo:', e);
        res.status(500).json({ en_vivo: false, video_id: null });
    }
});

module.exports = router;