import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import bodyParser from 'body-parser';

const app = express();
const PORT = 3000;

import { fileURLToPath } from 'url';
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const dbPath = path.join(__dirname, 'public', 'c1', 'c1_comments.json');

// Ensure directory exists
const ensureDirectoryExistence = async (filePath) => {
    const dirname = path.dirname(filePath);
    try {
        await fs.mkdir(dirname, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') {
            throw err;
        }
    }
};

// Middleware
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/comments', async (req, res) => {
    try {
        const data = await fs.readFile(dbPath, 'utf8');
        const comments = data ? JSON.parse(data) : [];
        res.json(comments);
    } catch (err) {
        if (err.code === 'ENOENT') {
            res.json([]);
        } else {
            console.error(err);
            res.status(500).json({ success: false, message: 'Internal Server Error' });
        }
    }
});

app.post('/addComment', async (req, res) => {
    const { email, comment } = req.body;

    console.log('Received request body:', req.body); // Debugging line

    if (!email || !comment) {
        return res.status(400).json({ success: false, message: 'Email and comment are required' });
    }

    try {
        await ensureDirectoryExistence(dbPath);

        let comments = [];
        try {
            const data = await fs.readFile(dbPath, 'utf8');
            comments = data ? JSON.parse(data) : [];
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
        }

        comments.push({ email, comment });
        await fs.writeFile(dbPath, JSON.stringify(comments, null, 2));

        console.log('Updated comments:', comments); // Debugging line

        res.json({ success: true });
    } catch (err) {
        console.error('Error:', err); // Improved error logging
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
