const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const AWS = require('aws-sdk');
const bcrypt = require('bcryptjs');
const app = express();

// Middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

// MySQL Connection Pools
const poolFiles = mysql.createPool({
    connectionLimit: 10,
    host: "music-sheets-db.cjvk1usvwbh8.us-east-1.rds.amazonaws.com",
    user: "master",
    password: "Apple.com123",
    database: "Upload_files",
});

const poolUsers = mysql.createPool({
    connectionLimit: 10,
    host: "music-sheets-db.cjvk1usvwbh8.us-east-1.rds.amazonaws.com",
    user: "master",
    password: "Apple.com123",
    database: "user_info",
});

// Utility to Execute MySQL Queries
const executeQuery = (pool, query, params = []) =>
    new Promise((resolve, reject) => {
        pool.query(query, params, (err, results) => {
            if (err) {
                return reject(err);
            }
            resolve(results);
        });
    });

// AWS Cognito Setup
AWS.config.update({ region: 'us-east-1' });
const cognito = new AWS.CognitoIdentityServiceProvider();

// Test Database Connections
poolFiles.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to Upload_files database:', err);
    } else {
        console.log('Connected to Upload_files database.');
        connection.release();
    }
});

poolUsers.getConnection((err, connection) => {
    if (err) {
        console.error('Error connecting to user_info database:', err);
    } else {
        console.log('Connected to user_info database.');
        connection.release();
    }
});

// Routes
app.get('/', (req, res) => res.json({ message: 'Connected to the Server!' }));

// Add Music Sheet
// app.post('/', async (req, res) => {
//     const { name, artistName, genre, datePublished, file_data, file_name } = req.body;
//     try {
//         const query = `
//             INSERT INTO test6 (name, artistName, genre, datePublished, file_data, file_name,preview_related)
//             VALUES (?, ?, ?, ?, ?, ?)
//         `;
//         await executeQuery(poolFiles, query, [name, artistName, genre, datePublished, file_data, file_name]);
//         res.status(201).json({ message: 'Music sheet added successfully' });
//     } catch (err) {
//         console.error('Error adding music sheet:', err);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

app.post('/', async (req, res) => {
    const { name, artistName, genre, datePublished, file_data, file_name, preview_related } = req.body; // Include preview_related
    try {
        const query = `
            INSERT INTO test6 (name, artistName, genre, datePublished, file_data, file_name, preview_related)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        await executeQuery(poolFiles, query, [name, artistName, genre, datePublished, file_data, file_name, preview_related]);
        res.status(201).json({ message: 'Music sheet added successfully' });
    } catch (err) {
        console.error('Error adding music sheet:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get Music Sheets
// app.get('/table-data', async (req, res) => {
//     try {
//         const query = 'SELECT id, name, artistName, genre, datePublished, file_name FROM test6';
//         const data = await executeQuery(poolFiles, query);
//         res.status(200).json(data);
//     } catch (err) {
//         console.error('Error retrieving table data:', err);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

// app.get('/table-data', async (req, res) => {
//     try {
//         const query = 'SELECT id, name, artistName, genre, datePublished, file_name, preview_related FROM test6'; // Include preview_related
//         const data = await executeQuery(poolFiles, query);
//         res.status(200).json(data);
//     } catch (err) {
//         console.error('Error retrieving table data:', err);
//         res.status(500).json({ message: 'Internal Server Error' });
//     }
// });

app.get('/table-data', async (req, res) => {
    try {
        const query = 'SELECT id, name, artistName, genre, datePublished, file_name, preview_related FROM test6';
        const data = await executeQuery(poolFiles, query);

        // Convert Blob to Base64 for `preview_related`
        const transformedData = data.map((item) => {
            if (item.preview_related) {
                const base64Image = Buffer.from(item.preview_related).toString('base64');
                item.preview_related = `data:image/png;base64,${base64Image}`;
            }
            return item;
        });

        res.status(200).json(transformedData);
    } catch (err) {
        console.error('Error retrieving table data:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Delete Music Sheet
app.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'DELETE FROM test6 WHERE id = ?';
        await executeQuery(poolFiles, query, [id]);
        res.status(200).json({ message: 'Music sheet deleted successfully' });
    } catch (err) {
        console.error('Error deleting music sheet:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Download File
app.get('/download/:id', async (req, res) => {
    const { id } = req.params;
    try {
        const query = 'SELECT file_data FROM test6 WHERE id = ?';
        const [file] = await executeQuery(poolFiles, query, [id]);

        if (!file) {
            return res.status(404).json({ message: 'File not found' });
        }

        res.setHeader('Content-Type', 'application/pdf'); // Assuming the file is a PDF
        res.send(file.file_data);
    } catch (err) {
        console.error('Error downloading file:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Get All Users
app.get('/users', async (req, res) => {
    try {
        const query = 'SELECT * FROM users';
        const users = await executeQuery(poolUsers, query);
        res.status(200).json(users);
    } catch (err) {
        console.error('Error fetching users:', err);
        res.status(500).json({ message: 'Database error' });
    }
});

// Delete User
app.delete('/deleteUser/:userId', async (req, res) => {
    const { userId } = req.params;
    const { email } = req.body;

    try {
        // Delete related records in announcements
        await executeQuery(poolUsers, 'DELETE FROM announcements WHERE user_id = ?', [userId]);

        // Delete user from MySQL
        await executeQuery(poolUsers, 'DELETE FROM users WHERE id = ?', [userId]);

        // Delete user from AWS Cognito
        const params = {
            UserPoolId: 'us-east-1_aj3MKp9bc', // Replace with your UserPoolId
            Username: email,
        };
        cognito.adminDeleteUser(params, (err) => {
            if (err) {
                console.error('Error deleting user from Cognito:', err);
                return res.status(500).json({ message: 'Failed to delete user from Cognito' });
            }
            res.status(200).json({ message: 'User deleted successfully' });
        });
    } catch (err) {
        console.error('Error deleting user:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Signup User
app.post('/signup', async (req, res) => {
    const { firstName, lastName, displayName, email, password, dateOfBirth, address, userType } = req.body;

    try {
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = `
            INSERT INTO users (firstName, lastName, displayName, email, password, dateOfBirth, address, userType)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        await executeQuery(poolUsers, query, [firstName, lastName, displayName, email, hashedPassword, dateOfBirth, address, userType]);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (err) {
        console.error('Error signing up user:', err);
        res.status(500).json({ message: 'Internal Server Error' });
    }
});

// Start Server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});