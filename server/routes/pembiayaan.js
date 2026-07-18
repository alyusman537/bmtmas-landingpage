import { Router } from 'express';
import pool from '../db.js';
import auth from '../middleware/auth.js';

const router = Router();

router.get('/', async (_req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM pembiayaan ORDER BY id');
    const data = rows.map((r) => ({ ...r, deskripsi: JSON.parse(r.deskripsi) }));
    res.json(data);
  } catch (err) {
    console.error('GET pembiayaan error:', err);
    res.status(500).json({ message: 'Gagal mengambil data pembiayaan' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { nama_produk, deskripsi } = req.body;
    const [result] = await pool.query(
      'INSERT INTO pembiayaan (nama_produk, deskripsi) VALUES (?, ?)',
      [nama_produk, JSON.stringify(deskripsi)]
    );
    const [rows] = await pool.query('SELECT * FROM pembiayaan WHERE id = ?', [result.insertId]);
    res.status(201).json({ ...rows[0], deskripsi: JSON.parse(rows[0].deskripsi) });
  } catch (err) {
    console.error('POST pembiayaan error:', err);
    res.status(500).json({ message: 'Gagal menambah produk pembiayaan' });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { nama_produk, deskripsi } = req.body;
    await pool.query(
      'UPDATE pembiayaan SET nama_produk=?, deskripsi=? WHERE id=?',
      [nama_produk, JSON.stringify(deskripsi), req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM pembiayaan WHERE id = ?', [req.params.id]);
    if (!rows.length) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json({ ...rows[0], deskripsi: JSON.parse(rows[0].deskripsi) });
  } catch (err) {
    console.error('PUT pembiayaan error:', err);
    res.status(500).json({ message: 'Gagal mengupdate produk pembiayaan' });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM pembiayaan WHERE id = ?', [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ message: 'Produk tidak ditemukan' });
    res.json({ message: 'Produk berhasil dihapus' });
  } catch (err) {
    console.error('DELETE pembiayaan error:', err);
    res.status(500).json({ message: 'Gagal menghapus produk pembiayaan' });
  }
});

export default router;
