import { Router } from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import pool from '../db.js';
import auth from '../middleware/auth.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadsDir = path.join(__dirname, '..', 'uploads', 'galeri');
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
    const [rows] = await pool.query('SELECT * FROM galeri ORDER BY id DESC');
    res.json(rows);
  } catch (err) {
    console.error('GET galeri error:', err);
    res.status(500).json({ message: 'Gagal mengambil data galeri' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM galeri WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Foto tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    console.error('GET galeri by id error:', err);
    res.status(500).json({ message: 'Gagal mengambil data galeri' });
  }
});

router.post('/', auth, upload.single('foto'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File foto wajib diunggah' });
    const { judul, keterangan } = req.body;
    if (!judul) return res.status(400).json({ message: 'Judul wajib diisi' });

    const foto_url = `/uploads/galeri/${req.file.filename}`;
    const [result] = await pool.query(
      'INSERT INTO galeri (judul, keterangan, foto_url) VALUES (?, ?, ?)',
      [judul, keterangan || '', foto_url]
    );
    const [rows] = await pool.query('SELECT * FROM galeri WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('POST galeri error:', err);
    res.status(500).json({ message: 'Gagal menambah foto galeri' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { judul, keterangan } = req.body;
    await pool.query(
      'UPDATE galeri SET judul=?, keterangan=? WHERE id=?',
      [judul, keterangan || '', req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM galeri WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Foto tidak ditemukan' });
    res.json(rows[0]);
  } catch (err) {
    console.error('PUT galeri error:', err);
    res.status(500).json({ message: 'Gagal mengupdate foto galeri' });
  }
});

router.put('/:id/foto', auth, upload.single('foto'), async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'File foto wajib diunggah' });
    const [existing] = await pool.query('SELECT foto_url FROM galeri WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: 'Foto tidak ditemukan' });

    const oldPath = path.join(__dirname, '..', existing[0].foto_url);
    if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);

    const foto_url = `/uploads/galeri/${req.file.filename}`;
    await pool.query('UPDATE galeri SET foto_url=? WHERE id=?', [foto_url, req.params.id]);
    const [rows] = await pool.query('SELECT * FROM galeri WHERE id = ?', [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error('PUT galeri foto error:', err);
    res.status(500).json({ message: 'Gagal mengganti foto galeri' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [existing] = await pool.query('SELECT foto_url FROM galeri WHERE id = ?', [req.params.id]);
    if (!existing.length) return res.status(404).json({ message: 'Foto tidak ditemukan' });

    const filePath = path.join(__dirname, '..', existing[0].foto_url);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query('DELETE FROM galeri WHERE id = ?', [req.params.id]);
    res.json({ message: 'Foto galeri berhasil dihapus' });
  } catch (err) {
    console.error('DELETE galeri error:', err);
    res.status(500).json({ message: 'Gagal menghapus foto galeri' });
  }
});

export default router;
