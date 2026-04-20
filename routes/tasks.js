const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');

// GET /tasks - Mengambil seluruh daftar tugas
router.get('/', taskController.getAllTasks);

// GET /tasks/:id - Mengambil satu tugas berdasarkan ID
router.get('/:id', taskController.getTaskById);

// POST /tasks - Menambahkan tugas baru
router.post('/', taskController.createTask);

// PUT /tasks/:id - Memperbarui data tugas
router.put('/:id', taskController.updateTask);

// DELETE /tasks/:id - Menghapus tugas
router.delete('/:id', taskController.deleteTask);

module.exports = router;
