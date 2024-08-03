const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');

const AWS = require('aws-sdk');

const bcrypt = require('bcrypt');


const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

// for music sheets
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "music-sheets-db.cjvk1usvwbh8.us-east-1.rds.amazonaws.com",
    user: "master",
    password: "Apple.com123",
    database: "Upload_files"
});

// Test database connection
pool.getConnection((err, connection) => {
    if (err) {
        console.error("Database connection error:", err);
    } else {
        console.log('Database connected');
        connection.release();
    }
});

// Cache frequently accessed data if possible

app.get('/', (req, res) => {
    res.json('Connected to the Server!');
});


app.post('/', (req, res) => {
    const { name, artistName, genre, datePublished, file_data, file_name } = req.body;
    const query = "INSERT INTO test6 (name, artistName, genre, datePublished, file_data, file_name) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [name, artistName, genre, datePublished, file_data, file_name];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error("Error inserting record:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log("Record inserted:", result);
        res.json('Form received');
    });
});


// Retrieve only necessary columns to reduce data transfer
app.get('/table-data', (req, res) => {
    const query = "SELECT id, name, artistName, genre, datePublished, file_name FROM test6";

    pool.query(query, (err, result) => {
        if (err) {
            console.error("Error retrieving data:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log("Data retrieved:", result);
        res.json(result);
    });
});

app.delete('/delete/:id', (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM test6 WHERE id = ?";

    pool.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error deleting record:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        console.log("Record deleted:", result);
        res.json('Record deleted');
    });
});

app.get('/download/:id', (req, res) => {
    const id = req.params.id;
    const query = "SELECT file_data FROM test6 WHERE id = ?";

    pool.query(query, [id], (err, result) => {
        if (err) {
            console.error("Error retrieving file data:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        if (result.length > 0) {
            const fileData = result[0].file_data;
            res.setHeader('Content-type', 'application/pdf'); // Assuming it's a PDF file
            res.send(fileData);
        } else {
            res.status(404).json({ error: "File not found" });
        }
    });
});



// User_info:
// User_info database configuration
const userDb = mysql.createConnection({
    host: "music-sheets-db.cjvk1usvwbh8.us-east-1.rds.amazonaws.com",
    user: "master",
    password: "Apple.com123",
    database: "user_info"
});

userDb.connect((err) => {
    if (err) {
        console.error('Database connection failed:', err.stack);
        return;
    }
    console.log('Connected to user database.');
});

AWS.config.update({ region: 'us-east-1' });
const cognito = new AWS.CognitoIdentityServiceProvider();

app.get('/users', (req, res) => {
    const sql = 'SELECT * FROM users';

    userDb.query(sql, (err, results) => {
        if (err) {
            console.error('Error fetching users:', err);
            return res.status(500).json({ message: 'Database error' });
        }
        res.status(200).json(results);
    });
});

app.post('/signup', async (req, res) => {
    const { firstName, lastName, displayName, email, password, dateOfBirth, address, userType } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const sql = 'INSERT INTO users (firstName, lastName, displayName, email, password, dateOfBirth, address, userType) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
        const values = [firstName, lastName, displayName, email, hashedPassword, dateOfBirth, address, userType];

        userDb.query(sql, values, (err, results) => {
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

app.delete('/deleteUser/:userId', (req, res) => {
    const userId = req.params.userId;

    // First, fetch the user's email from the database
    userDb.query('SELECT email FROM users WHERE id = ?', [userId], (err, results) => {
        if (err) {
            console.error('Error fetching user email:', err);
            return res.status(500).json({ message: 'Database error: unable to fetch user email', error: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const email = results[0].email;

        // Delete user from MySQL
        userDb.query('DELETE FROM users WHERE id = ?', [userId], (err) => {
            if (err) {
                console.error('Error deleting user from database:', err);
                return res.status(500).json({ message: 'Database error: unable to delete user', error: err });
            }

            // Delete user from AWS Cognito
            const params = {
                UserPoolId: "us-east-1_aj3MKp9bc", // Replace with your UserPoolId
                Username: email
            };

            cognito.adminDeleteUser(params, (err) => {
                if (err) {
                    console.error('Error deleting user from Cognito:', err);
                    return res.status(500).json({ message: 'Cognito error: unable to delete user', error: err });
                }

                res.status(200).json({ message: 'User deleted successfully' });
            });
        });
    });
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
