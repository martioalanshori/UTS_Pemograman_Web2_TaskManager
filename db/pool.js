const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: process.env.DB_PORT || 5432,
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'postgres',
  database: process.env.DB_NAME || 'task_manager',
});

// Test koneksi saat pertama kali dijalankan
pool.connect()
  .then((client) => {
    console.log('✅ Berhasil terhubung ke PostgreSQL');
    client.release();
  })
  .catch((err) => {
    console.error('❌ Gagal terhubung ke PostgreSQL:', err.message);
  });

module.exports = pool;
