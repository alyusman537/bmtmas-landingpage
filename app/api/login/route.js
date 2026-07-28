import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import pool from '@/lib/db';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret';
const JWT_EXPIRES = process.env.JWT_EXPIRES || '24h';

export async function POST(request) {
  try {
    const { password } = await request.json();
    if (!password) {
      return NextResponse.json({ message: 'Password wajib diisi' }, { status: 400 });
    }

    const [rows] = await pool.query('SELECT id, password FROM admin LIMIT 1');
    if (!rows.length) {
      return NextResponse.json({ message: 'Admin tidak ditemukan' }, { status: 401 });
    }

    const match = await bcrypt.compare(password, rows[0].password);
    if (!match) {
      return NextResponse.json({ message: 'Password salah' }, { status: 401 });
    }

    const token = jwt.sign({ id: rows[0].id, role: 'admin' }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES,
    });

    return NextResponse.json({ token });
  } catch (err) {
    console.error('Login error:', err);
    return NextResponse.json({ message: 'Terjadi kesalahan server' }, { status: 500 });
  }
}
