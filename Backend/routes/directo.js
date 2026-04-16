const express = require('express');
const router = express.Router();
const pool = require('../config/database');

const API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

async function obtenerCacheDB() {
    const [rows] = await pool.query(
        `SELECT en_vivo, video_id, actualizado_en 
         FROM directo_cache 
         ORDER BY id DESC LIMIT 1`
    );
    if (rows.length === 0) return null;

    const antiguedad = Date.now() - new Date(rows[0].actualizado_en).getTime();
    if (antiguedad < 15 * 60 * 1000) return rows[0];
    return null;
}

async function guardarCacheDB(enVivo, videoId) {
    await pool.query(
        `INSERT INTO directo_cache (en_vivo, video_id, actualizado_en)
         VALUES (?, ?, NOW())`,
        [enVivo, videoId]
    );
}

router.get('/', async (req, res) => {
    try {
        const cache = await obtenerCacheDB();
        if (cache) return res.json({ en_vivo: cache.en_vivo, video_id: cache.video_id });

        const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${CHANNEL_ID}&eventType=live&type=video&key=${API_KEY}`;
        const ytData = await fetch(url).then(r => r.json());

        const enVivo = ytData.items?.length > 0;
        const videoId = enVivo ? ytData.items[0].id.videoId : null;

        await guardarCacheDB(enVivo, videoId);
        res.json({ en_vivo: enVivo, video_id: videoId });

    } catch (e) {
        console.error('Error en /api/directo:', e);
        res.status(500).json({ en_vivo: false, video_id: null });
    }
});

module.exports = router;