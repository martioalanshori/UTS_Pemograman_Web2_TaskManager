const pool = require('../db/pool');

// GET /tasks - Mengambil seluruh daftar tugas
const getAllTasks = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM tasks ORDER BY id ASC');
    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error getAllTasks:', err.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

// GET /tasks/:id - Mengambil satu tugas berdasarkan ID
const getTaskById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task dengan ID tersebut tidak ditemukan' });
    }

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error getTaskById:', err.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

// POST /tasks - Menambahkan tugas baru
const createTask = async (req, res) => {
  try {
    const { title, description } = req.body;

    // Validasi input: title wajib ada dan tidak boleh kosong/hanya spasi
    if (!title || title.trim() === '') {
      return res.status(400).json({ error: 'Title tidak boleh kosong' });
    }

    const result = await pool.query(
      'INSERT INTO tasks (title, description) VALUES ($1, $2) RETURNING *',
      [title.trim(), description || null]
    );

    res.status(201).json({
      message: 'Task berhasil dibuat',
      data: result.rows[0],
    });
  } catch (err) {
    console.error('Error createTask:', err.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

// PUT /tasks/:id - Memperbarui data tugas berdasarkan ID
const updateTask = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, is_completed } = req.body;

    // Cek apakah task dengan ID tersebut ada
    const checkResult = await pool.query('SELECT * FROM tasks WHERE id = $1', [id]);

    if (checkResult.rows.length === 0) {
      return res.status(404).json({ error: 'Task dengan ID tersebut tidak ditemukan' });
    }

    // Ambil data yang ada untuk field yang tidak dikirim
    const existingTask = checkResult.rows[0];
    const updatedTitle = title !== undefined ? title : existingTask.title;
    const updatedDescription = description !== undefined ? description : existingTask.description;
    const updatedIsCompleted = is_completed !== undefined ? is_completed : existingTask.is_completed;

    const result = await pool.query(
      'UPDATE tasks SET title = $1, description = $2, is_completed = $3 WHERE id = $4 RETURNING *',
      [updatedTitle, updatedDescription, updatedIsCompleted, id]
    );

    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error updateTask:', err.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

// DELETE /tasks/:id - Menghapus tugas berdasarkan ID
const deleteTask = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query('DELETE FROM tasks WHERE id = $1 RETURNING *', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Task dengan ID tersebut tidak ditemukan' });
    }

    res.status(200).json({ message: 'Task berhasil dihapus' });
  } catch (err) {
    console.error('Error deleteTask:', err.message);
    res.status(500).json({ error: 'Terjadi kesalahan pada server' });
  }
};

module.exports = {
  getAllTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
