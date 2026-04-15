const express = require('express');
const { nanoid } = require('nanoid');
const db = require('./db'); // This imports your code from db.js

const app = express();

// Middleware
app.use(express.json()); 
app.use(express.static('public')); // This will serve your HTML file from a 'public' folder

// ROUTES

// 1. API to shorten a URL
app.post('/shorten', (req, res) => {
    const { longUrl } = req.body;
    
    // Basic Validation
    if (!longUrl) {
        return res.status(400).json({ error: "Please provide a valid URL" });
    }

    // Generate a unique 7-character code
    const shortCode = nanoid(7); 
    
    try {
        // Save the pair to the database
        const insert = db.prepare('INSERT INTO urls (short_code, original_url) VALUES (?, ?)');
        insert.run(shortCode, longUrl);

        // Send back the full short URL
        res.json({ 
            shortUrl: `http://localhost:3000/${shortCode}`,
            shortCode: shortCode 
        });
    } catch (err) {
        res.status(500).json({ error: "Database error" });
    }
});

// 2. Redirect route
app.get('/:code', (req, res) => {
    const { code } = req.params;
    
    // Look for the long URL associated with this code
    const row = db.prepare('SELECT original_url FROM urls WHERE short_code = ?').get(code);

    if (row) {
        // Redirect the user to the original website
        return res.redirect(row.original_url);
    } else {
        // If code doesn't exist, show error
        return res.status(404).send('<h1>URL not found</h1><p>The link you are looking for does not exist.</p>');
    }
});

// Start the server
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is flying at http://localhost:${PORT}`);
});