const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcrypt');

const app = express();
const port = process.env.PORT || 3002;

app.use(bodyParser.json());
app.use(cors());

// MySQL connection configuration
const db = mysql.createConnection({
    host: "music-sheets-db.cjvk1usvwbh8.us-east-1.rds.amazonaws.com",
    user: "master",
    password: "Apple.com123",
    database: "user_info"
});

app.get('/', (req, res) => {
    res.json('Connected to the Server!');
});

db.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to database.');
});

app.get('/getUserId', (req, res) => {
    const email = req.query.email;

    const sql = 'SELECT id FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('Error fetching user ID:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user_id: results[0].id });
    });
});

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

// Endpoint to handle user signup
app.post('/signup', async (req, res) => {
    const { firstName, lastName, displayName, email, password, dateOfBirth, address, userType } = req.body;

    try {
        // Hash the password before storing it
        const hashedPassword = await bcrypt.hash(password, 10);

        const sql = 'INSERT INTO users (firstName, lastName, displayName, email, password, dateOfBirth, address, userType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [firstName, lastName, displayName, email, hashedPassword, dateOfBirth, address, userType];

        db.query(sql, values, (err, results) => {
            if (err) {
                console.error('Error inserting user:', err);
                return res.status(500).json({ message: 'Database error' });
            }
            res.status(200).json({ message: 'User registered successfully' });
        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

app.listen(port, () => {
    console.log(`User Server is running on port ${port}`);
});
