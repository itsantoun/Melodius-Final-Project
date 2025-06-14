const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3006;

// Middleware
app.use(bodyParser.json());
app.use(cors({
    origin: 'http://localhost:3000', // Replace with your frontend URL if hosted remotely
    methods: ['GET', 'POST', 'DELETE'],
    allowedHeaders: ['Content-Type']
}));

// MySQL connection configuration
const db = mysql.createConnection({
    host: "music-sheets-db.cjvk1usvwbh8.us-east-1.rds.amazonaws.com",
    user: "master",
    password: "Apple.com123",
    database: "user_info"
});

// Connect to MySQL
db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        process.exit(1); // Exit the server if DB connection fails
    }
    console.log('Connected to database.');
});

// Endpoint to fetch all announcements
app.get('/announcements', (req, res) => {
    console.log('Fetching all announcements...');
    const sql = 'SELECT a.*, u.displayName FROM announcements a JOIN users u ON a.user_id = u.id';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching announcements:', err);
            return res.status(500).json({ message: 'Database error while fetching announcements' });
        }
        console.log('Fetched announcements:', results);
        res.status(200).json(results);
    });
});


// Endpoint to fetch all announcements (ordered by creation date)
app.get('/announcements/all', (req, res) => {
    console.log('Fetching all announcements...');
    const sql = `
        SELECT a.*, u.displayName 
        FROM announcements a 
        JOIN users u ON a.user_id = u.id 
        ORDER BY a.created_at DESC
    `;

    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching all announcements:', err);
            return res.status(500).json({ message: 'Database error while fetching all announcements' });
        }
        console.log('Fetched all announcements:', results);
        res.status(200).json(results);
    });
});

// Endpoint to create a new announcement
app.post('/announcements', (req, res) => {
    const { user_id, post_text } = req.body;
    if (!user_id || !post_text) {
        return res.status(400).json({ message: 'Missing user_id or post_text' });
    }

    const created_at = new Date();
    const sql = 'INSERT INTO announcements (user_id, post_text, created_at) VALUES (?, ?, ?)';
    const values = [user_id, post_text, created_at];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error creating announcement:', err);
            return res.status(500).json({ message: 'Database error while creating announcement' });
        }
        console.log('Announcement created:', { post_id: results.insertId, user_id, post_text, created_at });
        res.status(200).json({
            post_id: results.insertId,
            user_id,
            post_text,
            created_at
        });
    });
});

// Endpoint to get user information by display name
app.get('/getUserInfo', (req, res) => {
    const displayName = req.query.displayName;
    if (!displayName) {
        return res.status(400).json({ message: 'Missing displayName query parameter' });
    }

    const sql = 'SELECT * FROM users WHERE displayName = ?';
    db.query(sql, [displayName], (err, results) => {
        if (err) {
            console.error('Error fetching user information:', err);
            return res.status(500).json({ message: 'Database error while fetching user information' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        console.log('Fetched user information:', results[0]);
        res.status(200).json(results[0]);
    });
});

// Endpoint to fetch announcements for a specific user
app.get('/announcements/user', (req, res) => {
    const { user_id } = req.query;

    if (!user_id) {
        return res.status(400).json({ message: 'Missing user_id in request parameters' });
    }

    console.log(`Fetching announcements for user_id: ${user_id}`);

    const sql = `
        SELECT a.*, u.displayName 
        FROM announcements a 
        JOIN users u ON a.user_id = u.id 
        WHERE a.user_id = ?
    `;

    db.query(sql, [user_id], (err, results) => {
        if (err) {
            console.error('Error fetching announcements for user:', err);
            return res.status(500).json({ message: 'Database error while fetching user-specific announcements' });
        }

        console.log(`Fetched announcements for user_id ${user_id}:`, results);
        res.status(200).json(results);
    });
});


// Endpoint to delete an announcement
app.delete('/announcements/:post_id', (req, res) => {
    const { post_id } = req.params;
    if (!post_id) {
        return res.status(400).json({ message: 'Missing post_id in request parameters' });
    }

    const sql = 'DELETE FROM announcements WHERE post_id = ?';
    db.query(sql, [post_id], (err, results) => {
        if (err) {
            console.error('Error deleting announcement:', err);
            return res.status(500).json({ message: 'Database error while deleting announcement' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        console.log('Announcement deleted successfully:', post_id);
        res.status(200).json({ message: 'Announcement deleted successfully' });
    });
});

// Start the server
app.listen(port, () => {
    console.log(`Announcement server is running on port ${port}`);
});