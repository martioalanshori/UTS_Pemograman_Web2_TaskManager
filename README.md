# Task Manager Backend API

Backend RESTful API untuk aplikasi Task Manager, dibangun menggunakan Node.js, Express.js, dan PostgreSQL.

Tugas UTS - Pemrograman Web 2

## Teknologi

- Node.js
- Express.js
- PostgreSQL
- Nodemon (development)

## Struktur Folder

```
task-manager-backend/
├── index.js                  # Entry point, setup Express dan middleware
├── routes/
│   └── tasks.js              # Definisi endpoint API
├── controllers/
│   └── taskController.js     # Logika bisnis CRUD
├── middleware/
│   └── logger.js             # Custom logging middleware
├── db/
│   └── pool.js               # Konfigurasi koneksi PostgreSQL
├── test-app.js               # Script pengujian otomatis
├── package.json
└── .env                      # Variabel lingkungan (tidak di-push ke repo)
```

## Instalasi

1. Clone repository

```bash
git clone <url-repository>
cd task-manager-backend
```

2. Install dependencies

```bash
npm install
```

3. Buat file `.env` di root folder

```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=your_password
DB_NAME=task_manager
PORT=3000
```

4. Buat database dan tabel di PostgreSQL

```sql
CREATE DATABASE task_manager;

\c task_manager

CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

## Menjalankan Server

```bash
npm run dev
```

Server berjalan di `http://localhost:3000`.

## API Endpoints

| Method | Endpoint      | Deskripsi                     |
|--------|---------------|-------------------------------|
| GET    | /tasks        | Mengambil seluruh daftar tugas |
| GET    | /tasks/:id    | Mengambil satu tugas berdasarkan ID |
| POST   | /tasks        | Menambahkan tugas baru         |
| PUT    | /tasks/:id    | Memperbarui data tugas         |
| DELETE | /tasks/:id    | Menghapus tugas                |

## Contoh Request dan Response

### POST /tasks

Request body:

```json
{
  "title": "Belajar Express",
  "description": "Pelajari routing dan middleware"
}
```

Response (201):

```json
{
  "message": "Task berhasil dibuat",
  "data": {
    "id": 1,
    "title": "Belajar Express",
    "description": "Pelajari routing dan middleware",
    "is_completed": false,
    "created_at": "2025-04-20T10:30:00.000Z"
  }
}
```

### Error Response

Validasi gagal (400):

```json
{
  "error": "Title tidak boleh kosong"
}
```

Data tidak ditemukan (404):

```json
{
  "error": "Task dengan ID tersebut tidak ditemukan"
}
```

## Fitur

- **CRUD lengkap** - Create, Read, Update, Delete untuk data tasks
- **Middleware logging** - Mencatat method, URL, dan timestamp setiap request
- **Validasi input** - Menolak request dengan title kosong atau hanya berisi spasi
- **Error handling** - Mengembalikan status 404 untuk ID yang tidak ditemukan
- **Koneksi PostgreSQL** - Menggunakan Pool untuk manajemen koneksi yang efisien

## Pengujian

Pastikan server sudah berjalan, lalu jalankan di terminal terpisah:

```bash
node test-app.js
```

Script menguji 10 skenario secara otomatis:

1. POST /tasks - Input valid
2. POST /tasks - Title kosong
3. POST /tasks - Title hanya spasi
4. GET /tasks - Ambil semua data
5. GET /tasks/:id - ID valid
6. GET /tasks/:id - ID tidak ditemukan
7. PUT /tasks/:id - Update valid
8. PUT /tasks/:id - ID tidak ditemukan
9. DELETE /tasks/:id - Delete valid
10. DELETE /tasks/:id - ID tidak ditemukan
