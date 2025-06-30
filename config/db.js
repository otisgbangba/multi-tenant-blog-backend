// config/db.js
const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
});

pool.on('connect', () => {
    console.log('Connected to the PostgreSQL database');
});

// Example function to run queries
const query = (text, params) => {
    return pool.query(text, params);
};

module.exports = {
    query,
    pool
};
