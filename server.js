// ============================================
// MODERN RESTAURANT - BACKEND SERVER
// Node.js + Express + SQLite
// ============================================

const express = require('express');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.static(__dirname)); // Serve static files (HTML, CSS, JS)

// Database setup
const dbPath = path.join(__dirname, 'reservations.db');
const db = new sqlite3.Database(dbPath, (err) => {
    if (err) {
        console.error('Error opening database:', err.message);
    } else {
        console.log('Connected to SQLite database.');
        // Create reservations table if it doesn't exist
        db.run(`CREATE TABLE IF NOT EXISTS reservations (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            date TEXT NOT NULL,
            time TEXT NOT NULL,
            guests INTEGER NOT NULL,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            phone TEXT NOT NULL,
            special_requests TEXT,
            status TEXT DEFAULT 'pending',
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )`, (err) => {
            if (err) {
                console.error('Error creating table:', err.message);
            } else {
                console.log('Reservations table ready.');
            }
        });

    }
});

// ============================================
// API ROUTES
// ============================================

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'Server is running' });
});

// Create a new reservation
app.post('/api/reservations', (req, res) => {
    const { date, time, guests, name, email, phone, specialRequests } = req.body;

    // Validation
    if (!date || !time || !guests || !name || !email || !phone) {
        return res.status(400).json({ 
            success: false, 
            message: 'All required fields must be filled' 
        });
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid email address' 
        });
    }

    // Date validation (must be in the future)
    const selectedDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (selectedDate < today) {
        return res.status(400).json({ 
            success: false, 
            message: 'Reservation date must be in the future' 
        });
    }

    // Insert reservation into database
    const sql = `INSERT INTO reservations (date, time, guests, name, email, phone, special_requests) 
                 VALUES (?, ?, ?, ?, ?, ?, ?)`;
    
    db.run(sql, [date, time, guests, name, email, phone, specialRequests || ''], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Error saving reservation. Please try again.' 
            });
        }

        res.json({
            success: true,
            message: 'Reservation submitted successfully! We will contact you shortly to confirm.',
            reservationId: this.lastID
        });
    });
});

// Get all reservations (for admin/management)
app.get('/api/reservations', (req, res) => {
    const sql = 'SELECT * FROM reservations ORDER BY created_at DESC';
    
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Error fetching reservations' 
            });
        }

        res.json({
            success: true,
            reservations: rows
        });
    });
});

// Get a specific reservation by ID
app.get('/api/reservations/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'SELECT * FROM reservations WHERE id = ?';
    
    db.get(sql, [id], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Error fetching reservation' 
            });
        }

        if (!row) {
            return res.status(404).json({ 
                success: false, 
                message: 'Reservation not found' 
            });
        }

        res.json({
            success: true,
            reservation: row
        });
    });
});

// Update reservation status (for admin)
app.patch('/api/reservations/:id/status', (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!['pending', 'confirmed', 'cancelled'].includes(status)) {
        return res.status(400).json({ 
            success: false, 
            message: 'Invalid status. Must be: pending, confirmed, or cancelled' 
        });
    }

    const sql = 'UPDATE reservations SET status = ? WHERE id = ?';
    
    db.run(sql, [status, id], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Error updating reservation' 
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Reservation not found' 
            });
        }

        res.json({
            success: true,
            message: 'Reservation status updated successfully'
        });
    });
});

// Delete a reservation
app.delete('/api/reservations/:id', (req, res) => {
    const { id } = req.params;
    const sql = 'DELETE FROM reservations WHERE id = ?';
    
    db.run(sql, [id], function(err) {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ 
                success: false, 
                message: 'Error deleting reservation' 
            });
        }

        if (this.changes === 0) {
            return res.status(404).json({ 
                success: false, 
                message: 'Reservation not found' 
            });
        }

        res.json({
            success: true,
            message: 'Reservation deleted successfully'
        });
    });
});

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
    console.log(`\nModern Restaurant Server running on http://localhost:${PORT}`);
    console.log(`API endpoints available at http://localhost:${PORT}/api`);
    console.log(`Website available at http://localhost:${PORT}\n`);
});

// Graceful shutdown
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error('Error closing database:', err.message);
        } else {
            console.log('Database connection closed.');
        }
        process.exit(0);
    });
});


