import { NextResponse } from 'next/server';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM simpanan ORDER BY id');
    const data = rows.map((r) => ({ ...r, deskripsi: JSON.parse(r.deskripsi) }));
    return NextResponse.json(data);
  } catch (err) {
    console.error('GET simpanan error:', err);
    return NextResponse.json({ message: 'Gagal mengambil data simpanan' }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = verifyAuth(request);
  if (!admin) {
    return NextResponse.json({ message: 'Token tidak ditemukan atau tidak valid' }, { status: 401 });
  }

  try {
    const { nama_produk, deskripsi } = await request.json();
    const [result] = await pool.query(
      'INSERT INTO simpanan (nama_produk, deskripsi) VALUES (?, ?)',
      [nama_produk, JSON.stringify(deskripsi)]
    );
    const [rows] = await pool.query('SELECT * FROM simpanan WHERE id = ?', [result.insertId]);
    return NextResponse.json({ ...rows[0], deskripsi: JSON.parse(rows[0].deskripsi) }, { status: 201 });
  } catch (err) {
    console.error('POST simpanan error:', err);
    return NextResponse.json({ message: 'Gagal menambah produk simpanan' }, { status: 500 });
  }
}
