const express = require('express');
require('dotenv').config();

const logger = require('./middleware/logger');
const taskRoutes = require('./routes/tasks');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware untuk parsing JSON
app.use(express.json());

// Middleware logging kustom (dipasang secara global)
app.use(logger);

// Routes
app.use('/tasks', taskRoutes);

// Route utama
app.get('/', (req, res) => {
  res.json({
    message: 'Task Manager Backend API',
    version: '1.0.0',
    endpoints: {
      'GET /tasks': 'Mengambil seluruh daftar tugas',
      'GET /tasks/:id': 'Mengambil satu tugas berdasarkan ID',
      'POST /tasks': 'Menambahkan tugas baru',
      'PUT /tasks/:id': 'Memperbarui data tugas',
      'DELETE /tasks/:id': 'Menghapus tugas',
    },
  });
});

// Jalankan server
app.listen(PORT, () => {
  console.log(`🚀 Server berjalan di http://localhost:${PORT}`);
});
