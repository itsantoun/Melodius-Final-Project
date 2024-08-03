const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mysql = require('mysql');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
require('dotenv').config();

const app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json({ limit: '50mb' }));
app.use(cors());

// Ensure the uploads directory exists
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Serve static files from the uploads directory
app.use('/uploads', express.static(uploadDir));

// MySQL connection pool
const pool = mysql.createPool({
    connectionLimit: 10,
    host: "music-sheets-db.cjvk1usvwbh8.us-east-1.rds.amazonaws.com",
    user: "master",
    password: "Apple.com123",
    database: "user_info"
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

// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadDir);
    },
    filename: function (req, file, cb) {
        cb(null, file.fieldname + '-' + Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Root route
app.get('/', (req, res) => {
    res.send('Connected to the Feeds Server!');
});

// Route for creating a post
app.post('/posts', upload.single('file'), (req, res) => {
    const { user_id, title, description } = req.body;
    const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
    const type = req.file.mimetype.startsWith('image/') ? 'image' : 'video';

    const query = "INSERT INTO posts (user_id, type, name, description, content_url, comments, created_at) VALUES (?, ?, ?, ?, ?, '[]', NOW())";
    const values = [user_id, type, title, description, fileUrl];

    pool.query(query, values, (err, result) => {
        if (err) {
            console.error("Error inserting post:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json({
            id: result.insertId,
            user_id,
            type,
            title,
            description,
            fileUrl,
            comments: [],
            created_at: new Date()
        });
    });
});

// Route for fetching posts
app.get('/posts', (req, res) => {
    const query = `SELECT p.*, u.displayName as user_displayname 
                   FROM posts p 
                   JOIN users u ON p.user_id = u.id 
                   ORDER BY p.created_at DESC`;

    pool.query(query, (err, results) => {
        if (err) {
            console.error("Error fetching posts:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json(results);
    });
});

// Route for commenting on a post
app.post('/posts/:id/comment', (req, res) => {
    const postId = req.params.id;
    const { user_id, comment } = req.body;

    // Fetch user display name
    const userQuery = "SELECT displayName FROM users WHERE id = ?";
    pool.query(userQuery, [user_id], (err, userResults) => {
        if (err) {
            console.error("Error fetching user:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }

        const user_displayname = userResults[0].displayName;

        const query = "SELECT comments FROM posts WHERE id = ?";
        pool.query(query, [postId], (err, results) => {
            if (err) {
                console.error("Error fetching comments:", err);
                return res.status(500).json({ error: "Internal Server Error" });
            }

            let comments = JSON.parse(results[0].comments);
            comments.push({ user_displayname, comment, created_at: new Date() });

            const updateQuery = "UPDATE posts SET comments = ? WHERE id = ?";
            pool.query(updateQuery, [JSON.stringify(comments), postId], (err, result) => {
                if (err) {
                    console.error("Error updating comments:", err);
                    return res.status(500).json({ error: "Internal Server Error" });
                }
                res.json({ message: 'Comment added' });
            });
        });
    });
});

// Route for deleting a post
app.delete('/posts/:id', (req, res) => {
    const postId = req.params.id;

    // Delete the post from the database
    const query = "DELETE FROM posts WHERE id = ?";
    pool.query(query, [postId], (err, result) => {
        if (err) {
            console.error("Error deleting post:", err);
            return res.status(500).json({ error: "Internal Server Error" });
        }
        res.json({ message: 'Post deleted successfully' });
    });
});

// Start server
const PORT = process.env.PORT || 3005;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
