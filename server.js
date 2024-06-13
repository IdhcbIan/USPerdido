import express from 'express';
import { promises as fs } from 'fs';
import path from 'path';
import bodyParser from 'body-parser';
import multer from 'multer';
import { fileURLToPath } from 'url';

const app = express();
const PORT = 3000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const commentsPath = path.join(__dirname, 'public', 'c1', 'c1_comments.json');
const postsPath = path.join(__dirname, 'public', 'c1', 'db', 'c1_posts.json');

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

// Set up multer for file uploads
const storage = multer.diskStorage({
    destination: async (req, file, cb) => {
        const dir = path.join(__dirname, 'public', 'c1', 'db', 'im');
        await ensureDirectoryExistence(dir);
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage: storage });

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/comments', async (req, res) => {
    try {
        const data = await fs.readFile(commentsPath, 'utf8');
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

    console.log('Received request body:', req.body);

    if (!email || !comment) {
        return res.status(400).json({ success: false, message: 'Email and comment are required' });
    }

    try {
        await ensureDirectoryExistence(commentsPath);

        let comments = [];
        try {
            const data = await fs.readFile(commentsPath, 'utf8');
            comments = data ? JSON.parse(data) : [];
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
        }

        comments.push({ email, comment });
        await fs.writeFile(commentsPath, JSON.stringify(comments, null, 2));

        console.log('Updated comments:', comments);

        res.json({ success: true });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

// Route to create a new post
app.post('/create-post', upload.single('image'), async (req, res) => {
    const { title, content } = req.body;
    const image = req.file ? req.file.filename : null;
    const newPost = { title, content, image, comments: [] };

    try {
        await ensureDirectoryExistence(postsPath);

        let posts = [];
        try {
            const data = await fs.readFile(postsPath, 'utf8');
            posts = data ? JSON.parse(data) : [];
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
        }

        posts.push(newPost);
        await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));

        console.log('Updated posts:', posts);

        res.status(201).json({ success: true, message: 'Post created' });
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.post('/add-comment', async (req, res) => {
    const { postId, email, comment } = req.body;

    if (!email || !comment) {
        return res.status(400).json({ success: false, message: 'Email and comment are required' });
    }

    try {
        await ensureDirectoryExistence(postsPath);

        let posts = [];
        try {
            const data = await fs.readFile(postsPath, 'utf8');
            posts = data ? JSON.parse(data) : [];
        } catch (err) {
            if (err.code !== 'ENOENT') throw err;
        }

        const post = posts[postId];
        if (post) {
            post.comments.push({ email, comment });

            await fs.writeFile(postsPath, JSON.stringify(posts, null, 2));

            console.log('Updated comments for post:', post);

            res.status(201).json({ success: true, message: 'Comment added' });
        } else {
            res.status(404).json({ success: false, message: 'Post not found' });
        }
    } catch (err) {
        console.error('Error:', err);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});

app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
});
