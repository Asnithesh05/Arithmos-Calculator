const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Database setup
const dbPath = path.join(__dirname, 'database', 'calculator.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Database connection error:', err.message);
    } else {
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS history (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            calculation TEXT NOT NULL,
            result TEXT NOT NULL,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`);
    }
});

// API Routes

/**
 * GET /api/history
 * Fetch the latest 20 calculation history records.
 */
app.get('/api/history', (req, res) => {
    const sql = 'SELECT * FROM history ORDER BY created_at DESC LIMIT 20';
    db.all(sql, [], (err, rows) => {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json(rows);
    });
});

/**
 * POST /api/history
 * Save a new calculation to the database.
 */
app.post('/api/history', (req, res) => {
    const { calculation, result } = req.body;
    if (!calculation || result === undefined) {
        res.status(400).json({ error: 'Calculation and result are required' });
        return;
    }

    const sql = 'INSERT INTO history (calculation, result) VALUES (?, ?)';
    db.run(sql, [calculation, result.toString()], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.status(201).json({
            id: this.lastID,
            calculation,
            result
        });
    });
});

/**
 * DELETE /api/history
 * Clear all history from the database.
 */
app.delete('/api/history', (req, res) => {
    const sql = 'DELETE FROM history';
    db.run(sql, [], function(err) {
        if (err) {
            res.status(500).json({ error: err.message });
            return;
        }
        res.json({ message: 'History cleared successfully', changes: this.changes });
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
