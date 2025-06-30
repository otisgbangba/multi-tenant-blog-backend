// server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./models');

// Routes
const authRoutes = require('./routes/auth');
const blogRoutes = require('./routes/blog');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/blogs', blogRoutes);

// Health Check
app.get('/', (req, res) => {
    res.send('🚀 Multi-Tenant Blogging Platform API is running.');
});

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Internal Server Error' });
});

// Start Server and Sync DB
db.sequelize.sync({ alter: true }) // Use { force: true } for dev resets
    .then(() => {
        app.listen(PORT, () => {
            console.log(`✅ Server running on http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('❌ Unable to start the server:', err);
    });
