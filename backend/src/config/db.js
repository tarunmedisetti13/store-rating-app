const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
    user: process.env.DB_USER || "postgres",
    host: process.env.DB_HOST || "localhost",
    database: process.env.DB_NAME || "store-rating",
    password: process.env.DB_PASS || "yourpassword",
    port: process.env.DB_PORT || 5432,
});

pool.connect()
    .then(client => {
        console.log("✅ Connected to PostgreSQL");
        client.release();
    })
    .catch(err => {
        console.error("❌ PostgreSQL connection error:", err.message);
    });

module.exports = pool;