const BASE = '/api';

function getToken() {
  if (typeof window === 'undefined') return null;
  return sessionStorage.getItem('adminAuth');
}

function headers(isAuth = false) {
  const h = { 'Content-Type': 'application/json' };
  if (isAuth) {
    const token = getToken();
    if (token) h['Authorization'] = `Bearer ${token}`;
  }
  return h;
}

async function request(path, options = {}) {
  const res = await fetch(`${BASE}${path}`, options);
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

// ─── Auth ────────────────────────────────────────────────────
export async function login(password) {
  const data = await request('/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ password }),
  });
  return data.token;
}

// ─── Berita ──────────────────────────────────────────────────
export async function getBerita() {
  return request('/berita');
}

export async function getBeritaById(id) {
  return request(`/berita/${id}`);
}

export async function createBerita(formData) {
  const token = getToken();
  const h = {};
  if (token) h['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}/berita`, {
    method: 'POST',
    headers: h,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function updateBerita(id, formData) {
  const token = getToken();
  const h = {};
  if (token) h['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}/berita/${id}`, {
    method: 'PUT',
    headers: h,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function deleteBerita(id) {
  return request(`/berita/${id}`, {
    method: 'DELETE',
    headers: headers(true),
  });
}

// ─── Simpanan ────────────────────────────────────────────────
export async function getSimpanan() {
  return request('/simpanan');
}

export async function createSimpanan(body) {
  return request('/simpanan', {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify(body),
  });
}

export async function updateSimpanan(id, body) {
  return request(`/simpanan/${id}`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify(body),
  });
}

export async function deleteSimpanan(id) {
  return request(`/simpanan/${id}`, {
    method: 'DELETE',
    headers: headers(true),
  });
}

// ─── Galeri ──────────────────────────────────────────────────
export async function getGaleri() {
  return request('/galeri');
}

export async function createGaleri(formData) {
  const token = getToken();
  const h = {};
  if (token) h['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}/galeri`, {
    method: 'POST',
    headers: h,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function updateGaleri(id, body) {
  return request(`/galeri/${id}`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify(body),
  });
}

export async function updateGaleriFoto(id, formData) {
  const token = getToken();
  const h = {};
  if (token) h['Authorization'] = `Bearer ${token}`;
  const res = await fetch(`${BASE}/galeri/${id}/foto`, {
    method: 'PUT',
    headers: h,
    body: formData,
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Request failed');
  return data;
}

export async function deleteGaleri(id) {
  return request(`/galeri/${id}`, {
    method: 'DELETE',
    headers: headers(true),
  });
}

// ─── Pembiayaan ──────────────────────────────────────────────
export async function getPembiayaan() {
  return request('/pembiayaan');
}

export async function createPembiayaan(body) {
  return request('/pembiayaan', {
    method: 'POST',
    headers: headers(true),
    body: JSON.stringify(body),
  });
}

export async function updatePembiayaan(id, body) {
  return request(`/pembiayaan/${id}`, {
    method: 'PUT',
    headers: headers(true),
    body: JSON.stringify(body),
  });
}

export async function deletePembiayaan(id) {
  return request(`/pembiayaan/${id}`, {
    method: 'DELETE',
    headers: headers(true),
  });
}
