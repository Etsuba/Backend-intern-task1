const express = require('express');
const { nanoid } = require('nanoid');
const db = require('./db');

const app = express();
app.use(express.json()); // To parse JSON bodies

// 1. API to shorten a URL
app.post('/shorten', (req, res) => {
    const { longUrl } = req.body;
    if (!longUrl) return res.status(400).json({ error: "URL is required" });

    const shortCode = nanoid(7); // Generates a 7-character ID
    
    const insert = db.prepare('INSERT INTO urls (short_code, original_url) VALUES (?, ?)');
    insert.run(shortCode, longUrl);

    res.json({ shortUrl: `http://localhost:3000/${shortCode}` });
});

// 2. Redirect route
app.get('/:code', (req, res) => {
    const { code } = req.params;
    const row = db.prepare('SELECT original_url FROM urls WHERE short_code = ?').get(code);

    if (row) {
        res.redirect(row.original_url);
    } else {
        res.status(404).send('URL not found');
    }
});

app.listen(3000, () => console.log('Server running on http://localhost:3000'));