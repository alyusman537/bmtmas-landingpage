import { Router } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '../db.js';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24h';

const router = Router();

router.post('/login', async (req, res) => {
  try {
    const { password } = req.body;
    if (!password) {
      return res.status(400).json({ message: 'Password wajib diisi' });
    }

    const [rows] = await pool.query('SELECT id, password FROM admin LIMIT 1');
    if (!rows.length) {
      return res.status(401).json({ message: 'Admin tidak ditemukan' });
    }

    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) {
      return res.status(401).json({ message: 'Password salah' });
    }

    const token = jwt.sign({ id: rows[0].id, role: 'admin' }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });

    res.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ message: 'Terjadi kesalahan server' });
  }
});

export default router;
