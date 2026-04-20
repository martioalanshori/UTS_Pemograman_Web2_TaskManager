Product Requirements Document (PRD)
Task Manager Backend System
Mata Kuliah: Pemrograman Web 2 Tipe Project: Backend API Development Stack: Node.js, Express.js, PostgreSQL
________________________________________
1. Ringkasan Eksekutif
Project ini bertujuan membangun sistem backend RESTful API untuk aplikasi Task Manager. Sistem dibangun menggunakan Node.js dengan framework Express.js, terhubung ke database PostgreSQL untuk penyimpanan data permanen, dilengkapi dengan middleware logging, validasi input, dan error handling yang terstruktur.
________________________________________
2. Tujuan Project
Mahasiswa mampu mengimplementasikan backend API yang production-ready dengan kemampuan CRUD penuh, koneksi database relasional, sistem keamanan input, dan pencatatan aktivitas request secara real-time.
________________________________________
3. Ruang Lingkup
Sistem mencakup pengelolaan data tasks melalui HTTP API, mulai dari pembuatan, pembacaan, pembaruan, hingga penghapusan data. Sistem tidak mencakup autentikasi pengguna, antarmuka frontend, maupun fitur notifikasi.
________________________________________
4. Spesifikasi Teknis
Runtime: Node.js Framework: Express.js Database: PostgreSQL Package Koneksi DB: pg (node-postgres) Development Server: Nodemon Format Data: JSON
________________________________________
5. Skema Database
Nama Tabel: tasks
Kolom	Tipe Data	Constraint
id	SERIAL	PRIMARY KEY
title	VARCHAR(255)	NOT NULL
description	TEXT	-
is_completed	BOOLEAN	DEFAULT false
created_at	TIMESTAMP	DEFAULT CURRENT_TIMESTAMP
Query pembuatan tabel:
CREATE TABLE tasks (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  is_completed BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
________________________________________
6. Spesifikasi Endpoint API
Base URL: http://localhost:3000
GET /tasks Mengambil seluruh daftar tugas dari database. Response berupa array objek tasks dengan status 200. Jika belum ada data, kembalikan array kosong.
GET /tasks/:id Mengambil satu tugas berdasarkan ID yang diberikan pada parameter URL. Jika ID ditemukan, kembalikan objek task dengan status 200. Jika tidak ditemukan, kembalikan status 404 dengan pesan error.
POST /tasks Menambahkan tugas baru ke database. Request body wajib menyertakan field title. Field description bersifat opsional. Sistem wajib memvalidasi bahwa title tidak kosong atau hanya berisi spasi. Jika validasi gagal, kembalikan status 400. Jika berhasil, kembalikan data task yang baru dibuat dengan status 201.
PUT /tasks/:id Memperbarui data tugas berdasarkan ID. Request body dapat menyertakan title, description, dan/atau is_completed. Jika ID tidak ditemukan, kembalikan status 404. Jika berhasil, kembalikan data task yang telah diperbarui dengan status 200.
DELETE /tasks/:id Menghapus tugas berdasarkan ID. Jika ID tidak ditemukan, kembalikan status 404 dengan pesan error. Jika berhasil, kembalikan pesan konfirmasi dengan status 200.
________________________________________
7. Spesifikasi Fitur Wajib
7.1 Middleware Logging Dibuat sebagai fungsi middleware kustom (bukan library pihak ketiga). Dipasang secara global sehingga aktif pada setiap request masuk. Mencetak ke console tiga informasi: metode HTTP (GET, POST, PUT, DELETE), URL yang diakses, dan timestamp waktu request. Contoh output: [2025-04-20T10:30:00.000Z] GET /tasks
7.2 Validasi Input (Status 400) Diterapkan khusus pada endpoint POST /tasks. Sistem memeriksa keberadaan field title pada request body. Sistem memeriksa bahwa nilai title tidak merupakan string kosong setelah di-trim. Jika validasi gagal, sistem menghentikan proses dan mengembalikan response status 400 beserta pesan error yang informatif. Proses penyimpanan ke database tidak boleh dijalankan jika validasi gagal.
7.3 Error Handling (Status 404) Diterapkan pada endpoint GET /tasks/:id, PUT /tasks/:id, dan DELETE /tasks/:id. Setelah query ke database dijalankan, sistem memeriksa apakah data dengan ID tersebut ditemukan. Jika tidak ditemukan (rowCount === 0 atau rows kosong), sistem mengembalikan response status 404 dengan pesan error yang sesuai.
7.4 Koneksi PostgreSQL Menggunakan package pg yang diinstall via npm. Konfigurasi koneksi (host, port, database, user, password) disimpan terpisah dalam file konfigurasi atau menggunakan Pool untuk manajemen koneksi yang efisien.
7.5 Nodemon Diinstall sebagai devDependency. Dikonfigurasi pada script package.json dengan perintah "dev": "nodemon index.js" atau sesuai nama file utama. Server otomatis restart setiap ada perubahan file.
________________________________________
8. Spesifikasi Response
Sukses GET (200):
{
  "id": 1,
  "title": "Belajar Express",
  "description": "Pelajari routing dan middleware",
  "is_completed": false,
  "created_at": "2025-04-20T10:30:00.000Z"
}
Sukses POST (201):
{
  "message": "Task berhasil dibuat",
  "data": { ... }
}
Error 400:
{
  "error": "Title tidak boleh kosong"
}
Error 404:
{
  "error": "Task dengan ID tersebut tidak ditemukan"
}
________________________________________
9. Struktur Folder yang Disarankan
task-manager-backend/
├── index.js           (entry point, setup express & middleware)
├── routes/
│   └── tasks.js       (definisi semua endpoint)
├── controllers/
│   └── taskController.js  (logika bisnis tiap endpoint)
├── middleware/
│   └── logger.js      (custom logging middleware)
├── db/
│   └── pool.js        (konfigurasi koneksi PostgreSQL)
├── package.json
└── .env               (variabel lingkungan DB)
________________________________________
10. Kriteria Penerimaan (Acceptance Criteria)
Server berhasil berjalan menggunakan nodemon tanpa error. Semua 5 endpoint dapat diakses dan mengembalikan response yang sesuai. Middleware logging mencetak informasi ke console pada setiap request. Endpoint POST /tasks menolak request dengan title kosong dan mengembalikan status 400. Endpoint GET, PUT, DELETE dengan ID tidak valid mengembalikan status 404. Data tersimpan secara permanen di PostgreSQL dan dapat diambil kembali setelah server restart.
________________________________________
11. Dependensi Package
Dependencies:
•	express
•	pg
DevDependencies:
•	nodemon
12. Testing Script (test-app.js)
File test-app.js dibuat di root folder project dan dijalankan secara terpisah menggunakan perintah node test-app.js setelah server aktif. Script ini menguji seluruh endpoint dan kriteria penerimaan secara otomatis menggunakan Node.js built-in fetch (Node 18+) atau package node-fetch.
Cara Menjalankan: Pastikan server sudah berjalan terlebih dahulu di terminal pertama (npm run dev), lalu jalankan script test di terminal kedua (node test-app.js).
Skenario Pengujian yang Harus Dicakup:
Test 1 - POST /tasks (valid): Kirim request dengan title dan description yang valid. Ekspektasi: status 201, data task dikembalikan dengan field id, title, description, is_completed, dan created_at.
Test 2 - POST /tasks (validasi gagal, title kosong): Kirim request dengan title berupa string kosong "". Ekspektasi: status 400, response berisi pesan error.
Test 3 - POST /tasks (validasi gagal, title hanya spasi): Kirim request dengan title berupa " " (spasi saja). Ekspektasi: status 400, response berisi pesan error.
Test 4 - GET /tasks: Kirim request tanpa parameter. Ekspektasi: status 200, response berupa array yang minimal berisi task yang dibuat pada Test 1.
Test 5 - GET /tasks/:id (valid): Kirim request menggunakan ID yang didapat dari Test 1. Ekspektasi: status 200, data task yang sesuai dikembalikan.
Test 6 - GET /tasks/:id (ID tidak ada): Kirim request dengan ID fiktif seperti 99999. Ekspektasi: status 404, response berisi pesan error.
Test 7 - PUT /tasks/:id (valid): Kirim request dengan ID dari Test 1, update title dan set is_completed menjadi true. Ekspektasi: status 200, data task yang diperbarui dikembalikan.
Test 8 - PUT /tasks/:id (ID tidak ada): Kirim request PUT dengan ID fiktif 99999. Ekspektasi: status 404, response berisi pesan error.
Test 9 - DELETE /tasks/:id (valid): Kirim request DELETE menggunakan ID dari Test 1. Ekspektasi: status 200, pesan konfirmasi penghapusan.
Test 10 - DELETE /tasks/:id (ID tidak ada): Kirim request DELETE dengan ID fiktif 99999. Ekspektasi: status 404, response berisi pesan error.
Format Output Console test-app.js:
Script mencetak hasil setiap test ke console dengan format yang jelas, contoh:
============================
 TASK MANAGER - AUTO TESTER
============================

[TEST 1] POST /tasks - Input valid
  → Status: 201 ✓
  → Task ID: 3
  → PASSED

[TEST 2] POST /tasks - Title kosong
  → Status: 400 ✓
  → PASSED

[TEST 3] POST /tasks - Title hanya spasi
  → Status: 400 ✓
  → PASSED

...

============================
HASIL: 10/10 TEST PASSED
============================
Jika ada test yang gagal, script mencetak keterangan FAILED beserta status yang diterima vs status yang diharapkan, sehingga mahasiswa dapat langsung mengidentifikasi bagian mana yang belum sesuai kriteria.
Catatan Implementasi test-app.js: Script harus berjalan secara sequential (async/await), bukan paralel, agar ID dari Test 1 dapat digunakan kembali oleh test-test berikutnya. Semua request menggunakan BASE_URL yang didefinisikan sebagai variabel di bagian atas file sehingga mudah diganti jika port berbeda.
