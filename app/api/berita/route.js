import { NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';
import pool from '@/lib/db';
import { verifyAuth } from '@/lib/auth';

export async function GET() {
  try {
    const [rows] = await pool.query('SELECT * FROM berita ORDER BY id DESC');
    const data = rows.map((r) => ({ ...r, konten: JSON.parse(r.konten) }));
    return NextResponse.json(data);
  } catch (err) {
    console.error('GET berita error:', err);
    return NextResponse.json({ message: 'Gagal mengambil data berita' }, { status: 500 });
  }
}

export async function POST(request) {
  const admin = verifyAuth(request);
  if (!admin) {
    return NextResponse.json({ message: 'Token tidak ditemukan atau tidak valid' }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const kategori = formData.get('kategori');
    const tanggal = formData.get('tanggal');
    const penulis = formData.get('penulis');
    const judul = formData.get('judul');
    const ringkasan = formData.get('ringkasan');
    const konten = formData.get('konten');
    const file = formData.get('foto');

    let foto_url = null;
    if (file && file.size > 0) {
      const ext = path.extname(file.name).toLowerCase();
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
      const uploadDir = path.join(process.cwd(), 'uploads', 'berita');
      fs.mkdirSync(uploadDir, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      fs.writeFileSync(path.join(uploadDir, filename), buffer);
      foto_url = `/uploads/berita/${filename}`;
    }

    const [result] = await pool.query(
      'INSERT INTO berita (kategori, tanggal, penulis, judul, foto_url, ringkasan, konten) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [kategori, tanggal, penulis, judul, foto_url, ringkasan || null, JSON.stringify(konten ? JSON.parse(konten) : [])]
    );
    const [rows] = await pool.query('SELECT * FROM berita WHERE id = ?', [result.insertId]);
    return NextResponse.json({ ...rows[0], konten: JSON.parse(rows[0].konten) }, { status: 201 });
  } catch (err) {
    console.error('POST berita error:', err);
    return NextResponse.json({ message: 'Gagal menambah berita' }, { status: 500 });
  }
}
