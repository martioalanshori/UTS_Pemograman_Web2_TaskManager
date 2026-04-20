// ============================
//  TASK MANAGER - AUTO TESTER
// ============================

const BASE_URL = 'http://localhost:3000';

let taskId = null; // Menyimpan ID task dari Test 1 untuk digunakan test berikutnya
let passed = 0;
let failed = 0;

// Helper function untuk menjalankan request
async function request(method, path, body = null) {
  const options = {
    method,
    headers: { 'Content-Type': 'application/json' },
  };
  if (body) {
    options.body = JSON.stringify(body);
  }
  const response = await fetch(`${BASE_URL}${path}`, options);
  const data = await response.json();
  return { status: response.status, data };
}

// Helper function untuk print hasil test
function printResult(testNum, description, expectedStatus, actualStatus, extra = '') {
  const statusMatch = expectedStatus === actualStatus;
  const icon = statusMatch ? '✓' : '✗';
  const result = statusMatch ? 'PASSED' : 'FAILED';

  console.log(`[TEST ${testNum}] ${description}`);
  console.log(`  → Status: ${actualStatus} ${icon}${!statusMatch ? ` (expected: ${expectedStatus})` : ''}`);
  if (extra) console.log(`  → ${extra}`);
  console.log(`  → ${result}`);
  console.log('');

  if (statusMatch) {
    passed++;
  } else {
    failed++;
  }
}

async function runTests() {
  console.log('============================');
  console.log(' TASK MANAGER - AUTO TESTER');
  console.log('============================');
  console.log('');

  // Test 1 - POST /tasks (valid)
  try {
    const res = await request('POST', '/tasks', {
      title: 'Belajar Express',
      description: 'Pelajari routing dan middleware',
    });
    taskId = res.data?.data?.id || null;
    printResult(1, 'POST /tasks - Input valid', 201, res.status, taskId ? `Task ID: ${taskId}` : '');
  } catch (err) {
    console.log('[TEST 1] POST /tasks - Input valid');
    console.log(`  → ERROR: ${err.message}`);
    console.log(`  → FAILED`);
    console.log('');
    failed++;
  }

  // Test 2 - POST /tasks (title kosong "")
  try {
    const res = await request('POST', '/tasks', { title: '' });
    printResult(2, 'POST /tasks - Title kosong', 400, res.status);
  } catch (err) {
    console.log('[TEST 2] POST /tasks - Title kosong');
    console.log(`  → ERROR: ${err.message}`);
    console.log(`  → FAILED`);
    console.log('');
    failed++;
  }

  // Test 3 - POST /tasks (title hanya spasi)
  try {
    const res = await request('POST', '/tasks', { title: '   ' });
    printResult(3, 'POST /tasks - Title hanya spasi', 400, res.status);
  } catch (err) {
    console.log('[TEST 3] POST /tasks - Title hanya spasi');
    console.log(`  → ERROR: ${err.message}`);
    console.log(`  → FAILED`);
    console.log('');
    failed++;
  }

  // Test 4 - GET /tasks
  try {
    const res = await request('GET', '/tasks');
    const isArray = Array.isArray(res.data);
    printResult(4, 'GET /tasks', 200, res.status, `Is Array: ${isArray}, Count: ${isArray ? res.data.length : 'N/A'}`);
  } catch (err) {
    console.log('[TEST 4] GET /tasks');
    console.log(`  → ERROR: ${err.message}`);
    console.log(`  → FAILED`);
    console.log('');
    failed++;
  }

  // Test 5 - GET /tasks/:id (valid)
  try {
    const res = await request('GET', `/tasks/${taskId}`);
    printResult(5, `GET /tasks/${taskId} - ID valid`, 200, res.status, `Title: ${res.data?.title || 'N/A'}`);
  } catch (err) {
    console.log(`[TEST 5] GET /tasks/${taskId} - ID valid`);
    console.log(`  → ERROR: ${err.message}`);
    console.log(`  → FAILED`);
    console.log('');
    failed++;
  }

  // Test 6 - GET /tasks/:id (ID tidak ada)
  try {
    const res = await request('GET', '/tasks/99999');
    printResult(6, 'GET /tasks/99999 - ID tidak ada', 404, res.status);
  } catch (err) {
    console.log('[TEST 6] GET /tasks/99999 - ID tidak ada');
    console.log(`  → ERROR: ${err.message}`);
    console.log(`  → FAILED`);
    console.log('');
    failed++;
  }

  // Test 7 - PUT /tasks/:id (valid)
  try {
    const res = await request('PUT', `/tasks/${taskId}`, {
      title: 'Belajar Express (Updated)',
      is_completed: true,
    });
    printResult(7, `PUT /tasks/${taskId} - Update valid`, 200, res.status, `is_completed: ${res.data?.is_completed}`);
  } catch (err) {
    console.log(`[TEST 7] PUT /tasks/${taskId} - Update valid`);
    console.log(`  → ERROR: ${err.message}`);
    console.log(`  → FAILED`);
    console.log('');
    failed++;
  }

  // Test 8 - PUT /tasks/:id (ID tidak ada)
  try {
    const res = await request('PUT', '/tasks/99999', { title: 'Test' });
    printResult(8, 'PUT /tasks/99999 - ID tidak ada', 404, res.status);
  } catch (err) {
    console.log('[TEST 8] PUT /tasks/99999 - ID tidak ada');
    console.log(`  → ERROR: ${err.message}`);
    console.log(`  → FAILED`);
    console.log('');
    failed++;
  }

  // Test 9 - DELETE /tasks/:id (valid)
  try {
    const res = await request('DELETE', `/tasks/${taskId}`);
    printResult(9, `DELETE /tasks/${taskId} - Delete valid`, 200, res.status, `Message: ${res.data?.message || 'N/A'}`);
  } catch (err) {
    console.log(`[TEST 9] DELETE /tasks/${taskId} - Delete valid`);
    console.log(`  → ERROR: ${err.message}`);
    console.log(`  → FAILED`);
    console.log('');
    failed++;
  }

  // Test 10 - DELETE /tasks/:id (ID tidak ada)
  try {
    const res = await request('DELETE', '/tasks/99999');
    printResult(10, 'DELETE /tasks/99999 - ID tidak ada', 404, res.status);
  } catch (err) {
    console.log('[TEST 10] DELETE /tasks/99999 - ID tidak ada');
    console.log(`  → ERROR: ${err.message}`);
    console.log(`  → FAILED`);
    console.log('');
    failed++;
  }

  // Hasil akhir
  console.log('============================');
  console.log(`HASIL: ${passed}/${passed + failed} TEST PASSED`);
  console.log('============================');
}

// Jalankan semua test secara sequential
runTests().catch((err) => {
  console.error('Gagal menjalankan test:', err.message);
  console.error('Pastikan server sudah berjalan di', BASE_URL);
});
