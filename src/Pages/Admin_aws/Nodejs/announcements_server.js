const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const app = express();
const port = process.env.PORT || 3006;

app.use(bodyParser.json());
app.use(cors());

// MySQL connection configuration
const db = mysql.createConnection({
    host: "music-sheets-db.cjvk1usvwbh8.us-east-1.rds.amazonaws.com",
    user: "master",
    password: "Apple.com123",
    database: "user_info"
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

// Endpoint to fetch all announcements
app.get('/announcements', (req, res) => {
    const sql = 'SELECT a.*, u.displayName FROM announcements a JOIN users u ON a.user_id = u.id';
    db.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching announcements:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json(results);
    });
});

// Endpoint to create a new announcement
app.post('/announcements', (req, res) => {
    const { user_id, post_text } = req.body;
    const created_at = new Date();

    const sql = 'INSERT INTO announcements (user_id, post_text, created_at) VALUES (?, ?, ?)';
    const values = [user_id, post_text, created_at];

    db.query(sql, values, (err, results) => {
        if (err) {
            console.error('Error creating announcement:', err);
            return res.status(500).json({ message: 'Database error' });
        }
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

    const sql = 'SELECT * FROM users WHERE displayName = ?';
    db.query(sql, [displayName], (err, results) => {
        if (err) {
            console.error('Error fetching user information:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(results[0]);
    });
});

app.delete('/announcements/:post_id', (req, res) => {
    const { post_id } = req.params;
    const sql = 'DELETE FROM announcements WHERE post_id = ?';

    db.query(sql, [post_id], (err, results) => {
        if (err) {
            console.error('Error deleting announcement:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ message: 'Announcement not found' });
        }
        res.status(200).json({ message: 'Announcement deleted successfully' });
    });
});


app.listen(port, () => {
    console.log(`Announcement server is running on port ${port}`);
});
