import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../db.js';
import auth from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads', 'berita');
fs.mkdirSync(uploadsDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => cb(null, uploadsDir),
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (_req, file, cb) => {
    const allowed = ['image/jpeg', 'image/png', 'image/webp'];
    cb(null, allowed.includes(file.mimetype));
  },
});

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM berita ORDER BY id DESC');
    const data = rows.map((r) => ({ ...r, konten: JSON.parse(r.konten) }));
    res.json(data);
  } catch (err) {
    console.error('GET berita error:', err);
    res.status(500).json({ message: 'Gagal mengambil data berita' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM berita WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Berita tidak ditemukan' });
    res.json({ ...rows[0], konten: JSON.parse(rows[0].konten) });
  } catch (err) {
    console.error('GET berita by id error:', err);
    res.status(500).json({ message: 'Gagal mengambil data berita' });
  }
});

router.post('/', auth, upload.single('foto'), async (req, res) => {
  try {
    const { kategori, tanggal, penulis, judul, ringkasan, konten } = req.body;
    const foto_url = req.file ? `/uploads/berita/${req.file.filename}` : null;
    const [result] = await pool.query(
      'INSERT INTO berita (kategori, tanggal, penulis, judul, foto_url, ringkasan, konten) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [kategori, tanggal, penulis, judul, foto_url, ringkasan || null, JSON.stringify(konten ? JSON.parse(konten) : [])]
    );
    const [rows] = await pool.query('SELECT * FROM berita WHERE id = ?', [result.insertId]);
    res.status(201).json({ ...rows[0], konten: JSON.parse(rows[0].konten) });
  } catch (err) {
    console.error('POST berita error:', err);
    res.status(500).json({ message: 'Gagal menambah berita' });
  }
});

router.put('/:id', auth, upload.single('foto'), async (req, res) => {
  try {
    const { kategori, tanggal, penulis, judul, ringkasan, konten } = req.body;
    const [existing] = await pool.query('SELECT foto_url FROM berita WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: 'Berita tidak ditemukan' });

    let foto_url = existing[0].foto_url;
    if (req.file) {
      if (foto_url) {
        const oldPath = path.join(__dirname, '..', foto_url);
        if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
      }
      foto_url = `/uploads/berita/${req.file.filename}`;
    }

    await pool.query(
      'UPDATE berita SET kategori=?, tanggal=?, penulis=?, judul=?, foto_url=?, ringkasan=?, konten=? WHERE id=?',
      [kategori, tanggal, penulis, judul, foto_url, ringkasan || null, JSON.stringify(konten ? JSON.parse(konten) : []), req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM berita WHERE id = ?', [req.params.id]);
    res.json({ ...rows[0], konten: JSON.parse(rows[0].konten) });
  } catch (err) {
    console.error('PUT berita error:', err);
    res.status(500).json({ message: 'Gagal mengupdate berita' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT foto_url FROM berita WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: 'Berita tidak ditemukan' });

    if (existing[0].foto_url) {
      const filePath = path.join(__dirname, '..', existing[0].foto_url);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await pool.query('DELETE FROM berita WHERE id = ?', [req.params.id]);
    res.json({ message: 'Berita berhasil dihapus' });
  } catch (err) {
    console.error('DELETE berita error:', err);
    res.status(500).json({ message: 'Gagal menghapus berita' });
  }
});

export default router;
