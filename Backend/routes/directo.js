const express = require('express');
const router = express.Router();
const pool = require('../config/database');

const API_KEY = process.env.YOUTUBE_API_KEY;
const VIDEO_ID = process.env.YOUTUBE_VIDEO_ID; // ID fijo del stream

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

router.get('/', async (req, res) => {
    try {
        const cache = await obtenerCacheDB();
        if (cache) return res.json({ en_vivo: cache.en_vivo, video_id: cache.video_id });

        // Usa videos en lugar de search (1 unidad vs 100)
        const url = `https://www.googleapis.com/youtube/v3/videos?part=snippet&id=${VIDEO_ID}&key=${API_KEY}`;
        const ytData = await fetch(url).then(r => r.json());
        console.log('YT RAW:', JSON.stringify(ytData, null, 2));

        const item = ytData.items?.[0];
        const enVivo = item?.snippet?.liveBroadcastContent === 'live';
        const videoId = enVivo ? VIDEO_ID : null;

        await guardarCacheDB(enVivo ? 1 : 0, videoId);
        res.json({ en_vivo: enVivo ? 1 : 0, video_id: videoId });

    } catch (e) {
        console.error('Error en /api/directo:', e);
        res.status(500).json({ en_vivo: false, video_id: null });
    }
});

module.exports = router;