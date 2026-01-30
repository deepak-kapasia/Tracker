const express = require('express');
const cors = require('cors');
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// MongoDB Connection
// Only connect if not already connected (useful for serverless cold starts)
const connectDB = async () => {
    if (mongoose.connection.readyState >= 1) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error:', err);
    }
};

// Middleware to ensure DB connection
app.use(async (req, res, next) => {
    await connectDB();
    console.log('MongoDB connected');
    next();
});

// Routes

// Get all data for a user
app.get('/api/:user', async (req, res) => {
    try {
        const { user } = req.params;
        let userData = await User.findOne({ name: user });

        if (!userData) {
            // Initialize if not exists (matching previous behavior)
            userData = new User({
                name: user,
                subjects: [],
                dailylogs: []
            });
            await userData.save();
        }
        res.json(userData);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// --- SUBJECTS ---

app.get('/api/:user/subjects', async (req, res) => {
    try {
        const { user } = req.params;
        const userData = await User.findOne({ name: user });
        res.json(userData ? userData.subjects : []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/:user/subjects', async (req, res) => {
    try {
        const { user } = req.params;
        const newSubjects = req.body;

        const userData = await User.findOneAndUpdate(
            { name: user },
            { subjects: newSubjects },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(userData.subjects);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/:user/subjects/:id', async (req, res) => {
    try {
        const { user, id } = req.params;
        const userData = await User.findOne({ name: user });

        if (userData) {
            userData.subjects = userData.subjects.filter(s => s.id !== parseInt(id) && s.id !== id);
            await userData.save();
            res.json(userData.subjects);
        } else {
            res.status(404).json({ error: 'User not found' });
        }
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});


// --- DAILY LOGS ---

app.get('/api/:user/dailylogs', async (req, res) => {
    try {
        const { user } = req.params;
        const userData = await User.findOne({ name: user });
        res.json(userData ? userData.dailylogs : []);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/:user/dailylogs', async (req, res) => {
    try {
        const { user } = req.params;
        const newLogs = req.body;

        const userData = await User.findOneAndUpdate(
            { name: user },
            { dailylogs: newLogs },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        res.json(userData.dailylogs);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Export app for Vercel
module.exports = app;

// Local server execution
if (require.main === module) {
    app.listen(PORT, () => {
        console.log(`Server running on http://localhost:${PORT}`);
    });
}
