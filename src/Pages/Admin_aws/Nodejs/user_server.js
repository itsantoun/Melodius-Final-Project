const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const bcrypt = require('bcryptjs');

const app = express();
const port = process.env.PORT || 3002;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// MySQL connection configuration
const db = mysql.createConnection({
    host: "music-sheets-db.cjvk1usvwbh8.us-east-1.rds.amazonaws.com",
    user: "master",
    password: "Apple.com123",
    database: "user_info"
});

// Validate database connection
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed:', err.stack);
        process.exit(1); // Exit the application if the DB connection fails
    }
    console.log('✅ Connected to the database.');
});

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Connected to the User Server!' });
});

// Get user ID by email
app.get('/getUserId', (req, res) => {
    const { email } = req.query;

    if (!email) {
        return res.status(400).json({ message: 'Email is required' });
    }

    const sql = 'SELECT id FROM users WHERE email = ?';
    db.query(sql, [email], (err, results) => {
        if (err) {
            console.error('❌ Error fetching user ID:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json({ user_id: results[0].id });
    });
});

// Get user information by displayName
app.get('/getUserInfo', (req, res) => {
    const { displayName } = req.query;

    if (!displayName) {
        return res.status(400).json({ message: 'Display name is required' });
    }

    const sql = 'SELECT * FROM users WHERE displayName = ?';
    db.query(sql, [displayName], (err, results) => {
        if (err) {
            console.error('❌ Error fetching user information:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(200).json(results[0]);
    });
});

// User signup endpoint
app.post('/signup', async (req, res) => {
    const { firstName, lastName, displayName, email, password, dateOfBirth, address, userType } = req.body;

    if (!firstName || !lastName || !email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        // Check if the email is already registered
        const checkEmailQuery = 'SELECT * FROM users WHERE email = ?';
        db.query(checkEmailQuery, [email], async (err, results) => {
            if (err) {
                console.error('❌ Error checking existing user:', err);
                return res.status(500).json({ message: 'Database error' });
            }

            if (results.length > 0) {
                return res.status(409).json({ message: 'User already exists' });
            }

            // Hash the password before storing it
            const hashedPassword = await bcrypt.hash(password, 10);

            // Insert user into the database
            const insertQuery =
                'INSERT INTO users (firstName, lastName, displayName, email, password, dateOfBirth, address, userType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
            const values = [firstName, lastName, displayName, email, hashedPassword, dateOfBirth, address, userType];

            db.query(insertQuery, values, (err, results) => {
                if (err) {
                    console.error('❌ Error inserting user:', err);
                    return res.status(500).json({ message: 'Database error' });
                }
                res.status(201).json({ message: 'User registered successfully' });
            });
        });
    } catch (error) {
        console.error('❌ Server error:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// Listen on the defined port
app.listen(port, () => {
    console.log(`✅ User Server is running on port ${port}`);
});


